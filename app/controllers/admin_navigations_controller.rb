class AdminNavigationsController < ApplicationController
  def index
    render inertia: "Admin/Navigations/Index", props: {
      navigations: Navigation.as_nested_tree
    }
  end

  def create
    navigation = Navigation.new(
      name: params[:name] || "New Navigation",
      navigation_parent_id: params[:navigation_parent_id],
      position: params[:position] || 0
    )

    if navigation.save
      redirect_to "/admin/navigations/#{navigation.id}/pages", flash: { success: "Navigation created successfully." }
    else
      redirect_to "/admin/navigations/#{navigation.id}/pages", flash: { error: navigation.errors.full_messages.join(", ") }
    end
  end

  def update
    navigation = Navigation.find(params[:id])

    # Only update the attributes that are provided
    update_params = {}
    update_params[:name] = params[:name] if params[:name].present?
    update_params[:external_link] = params[:external_link] if params.key?(:external_link)
    update_params[:navigation_parent_id] = params[:navigation_parent_id] if params.key?(:navigation_parent_id)
    update_params[:position] = params[:position] if params.key?(:position)

    if navigation.update(update_params)
      redirect_to "/admin/navigations/#{navigation.id}/pages", flash: { success: "Navigation updated successfully." }
    else
      redirect_to "/admin/navigations/#{navigation.id}/pages", flash: { error: navigation.errors.full_messages.join(", ") }
    end
  end

  def destroy
    navigation = Navigation.find(params[:id])
    navigation.destroy
    redirect_to admin_navigation_path, flash: { success: "Navigation deleted successfully." }
  end
end
