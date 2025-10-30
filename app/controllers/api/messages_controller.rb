module Api
  class MessagesController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def create
      conversation = Conversation.find(params[:conversation_id])
      unless [conversation.sender_id, conversation.recipient_id].include?(current_user.id)
        render json: { error: 'Forbidden' }, status: :forbidden and return
      end

      outcome = Messages::Create.run(conversation: conversation, user: current_user, body: params[:body])

      if outcome.valid?
        render json: MessageSerializer.new(outcome.result, scope: { current_user: current_user }).as_json, status: :created
      else
        render json: { errors: outcome.errors.full_messages }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: 'Failed to send message' }, status: :internal_server_error
    end

    def unread_count
      count = MessageReadReceipt.joins(:message)
        .where(user_id: current_user.id, read_at: nil)
        .count
      render json: { unread_count: count }
    end
  end
end


