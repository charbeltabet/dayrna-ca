Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "", to: "home#index"

  scope "admin" do
    scope "attachments" do
      scope "groups" do
        get "", to: "attachments#groups"
      end

      get ":id", to: "attachments#index"
      get "", to: "attachments#index"

      post "", to: "attachments#create"
      patch ":id", to: "attachments#update"
      delete ":id", to: "attachments#destroy"
    end
  end

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
