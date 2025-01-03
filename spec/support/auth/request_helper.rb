module Auth
  module RequestHelper
    def json_response
      JSON.parse(response.body)
    end

    def auth_headers(user)
      sign_in user
      { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
    end
  end
end