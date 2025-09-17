# frozen_string_literal: true

module Api
  class PetsController < ApplicationController
    before_action :set_pet, only: %i[show edit update destroy archive]
    before_action :authenticate_user!, only: [:index, :user_pets, :create, :update, :destroy, :archive]
    skip_before_action :verify_authenticity_token

    def index
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || 21).to_i

      search_params = {
        user_id: current_user.id,
        species: params[:species],
        page: page,
        per_page: per_page
      }

      result = Pets::Fetch.run(search_params)

      if result.valid?
        pets = result.result
        render json: {
          data: ActiveModelSerializers::SerializableResource.new(pets.to_a, each_serializer: PetSerializer),
          pagination: {
            pages: pets.total_pages,
            count: pets.total_entries,
            page: pets.current_page,
            items: pets.per_page,
            per_page: per_page
          },
          message: pets.empty? ? "No pets found." : nil
        }
      else
        render json: { errors: result.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def new
      @pet = Pet.new
      render json: {
        pet: {
          name: nil,
          species: nil,
          breed_1: nil,
          breed_2: nil,
          color_1: nil,
          color_2: nil,
          color_3: nil,
          gender: nil,
          microchip_id: nil,
          is_altered: nil
        }
      }, status: :ok
    rescue StandardError => e
      render json: { error: "Failed to initialize new pet", details: e.message }, status: :internal_server_error
    end

    def show
      serialized_pet = PetSerializer.new(@pet).as_json
      render json: serialized_pet, status: :ok
    end

    def edit; end

    def create
      Rails.logger.info("Create pet params received: #{pet_params.inspect}")
      outcome = Pets::Create.run(pet_params.merge(user_id: current_user.id))

      if outcome.valid?
        serialized_pet = PetSerializer.new(outcome.result).as_json
        render json: serialized_pet.merge(
          message: "Pet registered successfully"
        ), status: :created
      else
        Rails.logger.error("Validation failed: #{outcome.errors.full_messages}")
        render json: {
          errors: outcome.errors.full_messages,
          message: outcome.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end

    def update
      if @pet.user != current_user
        render json: { message: "You can only update your own pets" }, status: :forbidden
        return
      end

      outcome = Pets::Update.run(pet_params.merge(pet: @pet))

      if outcome.valid?
        serialized_pet = PetSerializer.new(outcome.result).as_json
        render json: serialized_pet.merge(
          message: "Pet updated successfully"
        ), status: :ok
      else
        render json: {
          errors: outcome.errors.full_messages,
          message: outcome.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end

    def destroy
      if @pet.user != current_user
        render json: { message: "You can only delete your own pets" }, status: :forbidden
        return
      end

      outcome = Pets::Destroy.run(pet: @pet)

      if outcome.valid?
        render json: { message: "Pet deleted successfully" }, status: :ok
      else
        render json: { message: "Failed to delete pet", error: outcome.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    rescue StandardError => e
      render json: { message: "Failed to delete pet", error: e.message }, status: :unprocessable_entity
    end

    def archive
      if @pet.user != current_user
        render json: { message: "You can only archive your own pets" }, status: :forbidden
        return
      end

      if @pet.archived_at.present?
        render json: { message: "Pet is already archived" }, status: :unprocessable_entity
        return
      end

      @pet.update!(archived_at: Time.current)

      render json: { message: "Pet archived successfully" }, status: :ok
    rescue StandardError => e
      render json: { message: "Failed to archive pet", error: e.message }, status: :unprocessable_entity
    end

    def user_pets
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || 21).to_i

      search_params = {
        user_id: current_user.id,
        species: params[:species],
        archived: params[:archived],
        page: page,
        per_page: per_page
      }

      result = Pets::Fetch.run(search_params)

      if result.valid?
        pets = result.result
        render json: {
          data: ActiveModelSerializers::SerializableResource.new(pets.to_a, each_serializer: PetSerializer),
          pagination: {
            pages: pets.total_pages,
            count: pets.total_entries,
            page: pets.current_page,
            items: pets.per_page,
            per_page: per_page
          },
          message: pets.empty? ? "You haven't registered any pets yet." : nil
        }
      else
        render json: { errors: result.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_pet
      @pet = Pet.active.find(params[:id])
    end

    def pet_params
      params.permit(
        :name,
        :species,
        :breed_1,
        :breed_2,
        :color_1,
        :color_2,
        :color_3,
        :gender,
        :microchip_id,
        :image,
        :is_altered
      )
    end
  end
end
