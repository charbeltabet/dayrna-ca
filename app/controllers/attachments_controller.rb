class AttachmentsController < ApplicationController
  def images
    records = RecordAttachment.last(10).as_json(
      methods: [
        :public_url
      ]
    )

    render json: {
      data: records
    }
  end
end
