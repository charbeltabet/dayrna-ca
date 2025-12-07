# frozen_string_literal: true

class AdminPagesController < ApplicationController
  def index
    navigation = Navigation.find(params[:navigation_id])
    render inertia: "Admin/Navigations/Index", props: {
      navigations: Navigation.as_nested_tree,
      selectedNavigation: navigation.as_tree
    }
  end

  def show
    navigation = Navigation.find(params[:navigation_id])
    page = Page.find(params[:id])
    render inertia: "Admin/Navigations/Index", props: {
      navigations: Navigation.as_nested_tree,
      selectedNavigation: navigation.as_tree,
      selectedPage: page.as_json(methods: [ :full_path ])
    }
  end

  def create
    navigation = Navigation.find(params[:navigation_id])
    page = navigation.pages.new(
      title: params[:title] || "New Page",
      content: params[:content] || "Page content goes here.",
      position: navigation.pages.count
    )

    if page.save
      redirect_to admin_navigation_page_path(navigation, page), flash: { success: "Page created successfully." }
    else
      redirect_to admin_navigation_pages_path(navigation), flash: { error: page.errors.full_messages.join(", ") }
    end
  end

  def update
    navigation = Navigation.find(params[:navigation_id])
    page = Page.find(params[:id])

    # Only allow updating specific fields (slug is auto-generated from title)
    update_params = {}
    update_params[:title] = params[:title] if params.key?(:title)
    update_params[:content] = params[:content] if params.key?(:content)
    update_params[:position] = params[:position] if params.key?(:position)

    if page.update(update_params)
      redirect_to admin_navigation_page_path(navigation, page), flash: { success: "Page updated successfully." }
    else
      redirect_to admin_navigation_page_path(navigation, page), flash: { error: page.errors.full_messages.join(", ") }
    end
  end

  def destroy
    navigation = Navigation.find(params[:navigation_id])
    page = Page.find(params[:id])
    page.destroy
    redirect_to admin_navigation_pages_path(navigation), flash: { success: "Page deleted successfully." }
  end
end
