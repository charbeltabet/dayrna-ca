# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    data = HomePageData.home_component_data

    meta, attachments = paginate(RecordAttachment.order(created_at: :desc))
    attachment_groups = AttachmentsGroup.all
    attachment_groups_data = attachment_groups.map do |group|
      group.as_json.merge(
        recent_attachments: group.record_attachments
          .where("record_attachments.created_at IS NOT NULL")
          .order(created_at: :desc)
          .limit(10)
          .as_json(methods: [ :public_url ])
      )
    end

    render inertia: "Home/index", props: {
      homePageData: data,
      attachments: InertiaRails.scroll(meta, wrapper: "data") {
        {
          data: attachments.as_json(methods: [ :public_url ]),
          meta: meta
        }
      },
      attachment_groups: attachment_groups_data
    }
  end

  private

  PER_PAGE = 20

  def paginate(scope, page_param: :page)
    page = [ params.fetch(page_param, 1).to_i, 1 ].max

    records = scope.offset((page - 1) * PER_PAGE).limit(PER_PAGE + 1)

    meta = {
      page_name: page_param.to_s,
      previous_page: page > 1 ? page - 1 : nil,
      next_page: records.length > PER_PAGE ? page + 1 : nil,
      current_page: page,
      total_count: scope.count
    }

    [ meta, records.first(PER_PAGE) ]
  end
end
