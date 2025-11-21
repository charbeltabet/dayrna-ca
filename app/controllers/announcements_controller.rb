# frozen_string_literal: true

class AnnouncementsController < ApplicationController
  def index
    home_page_data = HomePageData.instance.data
    announcements = Announcement
      .published
      .where(published_at: ..Time.current)
      .order(
        published_at: :desc,
        id: :desc,
      ).as_json(
        methods: [
          :image_url,
          :text_preview
        ]
      )

    render inertia: "Announcements/Index", props: {
      announcements: announcements,
      homePageData: home_page_data
    }
  end

  def show
    home_page_data = HomePageData.instance.data
    announcement = Announcement.published.find(params[:id])
    next_announcement = Announcement
      .published
      .where("published_at >= ?", announcement.published_at)
      .where.not(id: announcement.id)
      .order(published_at: :asc)
      .first
    previous_announcement = Announcement
      .published
      .where("published_at <= ?", announcement.published_at)
      .where.not(id: announcement.id)
      .order(published_at: :desc)
      .first
    render inertia: "Announcements/Show", props: {
      announcement: announcement,
      nextAnnouncement: next_announcement,
      previousAnnouncement: previous_announcement,
      homePageData: home_page_data
    }
  end
end
