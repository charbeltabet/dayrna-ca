# frozen_string_literal: true

class AdminAnnouncementsController < ApplicationController
  def index
    render inertia: "Admin/Announcements/Index", props: {
      announcements: Announcement.order(id: :desc).as_json(
        methods: [
          :image_url,
          :text_preview
        ]
      )
    }
  end

  def create
    announcement = Announcement.create(
      title: "New Announcement",
      content: "Announcement content goes here.",
    )
    redirect_to admin_announcement_path(announcement), flash: { success: "Announcement created successfully." }
  end

  def show
    announcement = Announcement.find(params[:id])
    announcements = Announcement.order(id: :desc).as_json(
      methods: [
        :image_url,
        :text_preview
      ]
    )
    render inertia: "Admin/Announcements/Show", props: {
      announcement: announcement,
      announcements: announcements
    }
  end

  def update
    announcement = Announcement.find(params[:id])
    announcement.update(
      title: params[:title],
      content: params[:content],
      published_at: params[:published_at]
    )
    redirect_to admin_announcement_path(announcement), flash: { success: "Announcement updated successfully." }
  end

  def destroy
    announcement = Announcement.find(params[:id])
    announcement.destroy
    redirect_to admin_announcements_path, flash: { success: "Announcement deleted successfully." }
  end
end
