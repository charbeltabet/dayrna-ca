Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "", to: "home#index"

  scope "pages" do
    get "our-lady-icon", to: "pages#our_lady_icon", as: :our_lady_icon
  end

  scope "announcements" do
    get "", to: "announcements#index", as: :announcements
    get ":id", to: "announcements#show", as: :announcement
  end

  scope "admin" do
    get "", to: redirect("/admin/homepage")
    scope "attachments" do
      scope "groups" do
        get "search", to: "attachments#search_groups"
        get "json", to: "attachments#groups_json"
        get ":id", to: "attachments#groups"
        get "", to: "attachments#groups"
        post "", to: "attachments#create_group"
        patch ":id", to: "attachments#update_group"
        delete "(:id)", to: "attachments#destroy_group"
        post ":id/associate", to: "attachments#associate_to_group"
        post ":id/disassociate", to: "attachments#disassociate_from_group"
      end

      get "search", to: "attachments#search"

      get ":id", to: "attachments#index"
      get "", to: "attachments#index"

      post "", to: "attachments#create"
      patch ":id", to: "attachments#update"
      delete "", to: "attachments#destroy"
      delete ":id", to: "attachments#destroy"
    end

    scope "homepage" do
      get "", to: "admin_home#index", as: :admin_home
      patch "", to: "admin_home#update"
    end

    scope "announcements" do
      get "", to: "admin_announcements#index", as: :admin_announcements
      post "", to: "admin_announcements#create", as: :admin_create_announcement
      get ":id", to: "admin_announcements#show", as: :admin_announcement
      patch ":id", to: "admin_announcements#update", as: :admin_update_announcement
      delete ":id", to: "admin_announcements#destroy", as: :admin_delete_announcement
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
