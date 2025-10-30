module Api
  class ConversationsController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def index
      page = (params[:page] || 1).to_i
      per_page = 20

      conversations = Conversation
        .for_user(current_user.id)
        .includes(:sender, :recipient)
        .order(updated_at: :desc)
        .offset((page - 1) * per_page)
        .limit(per_page)

      render json: conversations.map { |c| ConversationSerializer.new(c, scope: { current_user: current_user }).as_json }
    end

    def create
      outcome = Conversations::Upsert.run(
        current_user: current_user,
        recipient_id: params[:recipient_id],
        messageable_type: params[:messageable_type],
        messageable_id: params[:messageable_id]
      )

      if outcome.valid?
        render json: ConversationSerializer.new(outcome.result, scope: { current_user: current_user }).as_json, status: :created
      else
        render json: { errors: outcome.errors.full_messages }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: 'Failed to create conversation' }, status: :internal_server_error
    end

    def show
      conversation = Conversation.find(params[:id])
      unless [conversation.sender_id, conversation.recipient_id].include?(current_user.id)
        render json: { error: 'Forbidden' }, status: :forbidden and return
      end

      page = (params[:page] || 1).to_i
      per_page = 20
      messages = conversation.messages.includes(:user).order(created_at: :asc)
        .offset((page - 1) * per_page).limit(per_page)

      Messages::MarkRead.run(conversation: conversation, user: current_user)

      render json: {
        conversation: ConversationSerializer.new(conversation, scope: { current_user: current_user }).as_json,
        messages: messages.map { |m| MessageSerializer.new(m, scope: { current_user: current_user }).as_json }
      }
    end

    def create_from_report
      report = ::Report.find(params[:id] || params[:report_id])
      if report.user_id == current_user.id
        render json: { error: 'Cannot start a conversation with yourself' }, status: :unprocessable_entity and return
      end

      outcome = Conversations::Upsert.run(
        current_user: current_user,
        recipient_id: report.user_id,
        messageable_type: 'Report',
        messageable_id: report.id
      )

      if outcome.valid?
        render json: ConversationSerializer.new(outcome.result, scope: { current_user: current_user }).as_json, status: :created
      else
        render json: { errors: outcome.errors.full_messages }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: 'Failed to start conversation' }, status: :internal_server_error
    end
  end
end


