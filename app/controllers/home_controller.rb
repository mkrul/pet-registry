# frozen_string_literal: true

class HomeController < ApplicationController
  def index
  end

  def up
    render json: { message: 'Server is up and running' }, status: :ok
  end
end
