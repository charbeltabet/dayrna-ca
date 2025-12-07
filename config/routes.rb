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

  scope "reference" do
    get "", to: "references#index", as: :reference_root
    get "*path", to: "references#show", as: :reference
  end

  scope "media" do
    get "", to: "media#index", as: :media_root
    get ":id", to: "media#show_group", as: :media_group
    get ":group_id/attachments/:id", to: "media#show_attachment", as: :media_attachment
  end

  scope "attachments" do
    get "images", to: "attachments#images", as: :attachment_images
  end

  scope "admin" do
    get "", to: redirect("/admin/homepage")
    scope "attachments" do
      scope "groups" do
        get "search", to: "admin_attachments#search_groups"
        get "json", to: "admin_attachments#groups_json"
        get ":id", to: "admin_attachments#groups"
        get "", to: "admin_attachments#groups"
        post "", to: "admin_attachments#create_group"
        patch ":id", to: "admin_attachments#update_group"
        delete "(:id)", to: "admin_attachments#destroy_group"
        post ":id/associate", to: "admin_attachments#associate_to_group"
        post ":id/disassociate", to: "admin_attachments#disassociate_from_group"
      end

      get "search", to: "admin_attachments#search"

      get ":id", to: "admin_attachments#index"
      get "", to: "admin_attachments#index"

      post "", to: "admin_attachments#create"
      patch ":id", to: "admin_attachments#update"
      delete "", to: "admin_attachments#destroy"
      delete ":id", to: "admin_attachments#destroy"
    end

    scope "homepage" do
      get "", to: "admin_home#index", as: :admin_home
      patch "", to: "admin_home#update"
    end

    scope "announcements" do
      get "", to: "admin_announcements#index", as: :admin_announcements
      get ":id", to: "admin_announcements#show", as: :admin_announcement
      post "", to: "admin_announcements#create", as: :admin_create_announcement
      patch ":id", to: "admin_announcements#update", as: :admin_update_announcement
      delete ":id", to: "admin_announcements#destroy", as: :admin_delete_announcement
    end

    scope "navigations" do
      get "", to: "admin_navigations#index", as: :admin_navigation
      post "", to: "admin_navigations#create", as: :admin_create_navigation
      patch ":id", to: "admin_navigations#update", as: :admin_update_navigation
      delete ":id", to: "admin_navigations#destroy", as: :admin_delete_navigation

      scope ":navigation_id/pages" do
        get "", to: "admin_pages#index", as: :admin_navigation_pages
        get ":id", to: "admin_pages#show", as: :admin_navigation_page
        post "", to: "admin_pages#create", as: :admin_create_navigation_page
        patch ":id", to: "admin_pages#update", as: :admin_update_navigation_page
        delete ":id", to: "admin_pages#destroy", as: :admin_delete_navigation_page
      end
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
