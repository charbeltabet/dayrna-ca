Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "", to: "home#index"

  scope "admin" do
    get "", to: redirect("/admin/homepage")
    scope "attachments" do
      scope "groups" do
        get "json", to: "attachments#groups_json"
        get ":id", to: "attachments#groups"
        get "", to: "attachments#groups"
        post "", to: "attachments#create_group"
        patch ":id", to: "attachments#update_group"
        delete "(:id)", to: "attachments#destroy_group"
        post ":id/associate", to: "attachments#associate_to_group"
        post ":id/disassociate", to: "attachments#disassociate_from_group"
      end

      get ":id", to: "attachments#index"
      get "", to: "attachments#index"

      post "", to: "attachments#create"
      patch ":id", to: "attachments#update"
      delete "", to: "attachments#destroy"
      delete ":id", to: "attachments#destroy"
    end

    scope "homepage" do
      get "", to: "homepage#index", as: :admin_homepage
      patch "", to: "homepage#update"
    end

    scope "shop" do
      get "label", to: "shop#label", as: :admin_shop_label
    end
  end

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
