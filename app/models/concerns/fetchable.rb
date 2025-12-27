module Fetchable
  extend ActiveSupport::Concern

  included do
    scope :fetch_records, ->(params = {}) {
      fields        = params[:fields] || []
      search_fields = params[:search_fields] || []
      order_by      = params[:order_by] || "created_at"
      order         = params[:order] || "desc"
      query         = params[:query]
      offset_val    = params[:offset] || 0
      limit_val     = params[:limit] || 0

      result = self

      # Select specific fields if provided
      result = result.select(*fields) if fields.any?

      # Search across specified fields if query is present
      if query.present? && search_fields.any?
        search_conditions = search_fields.map do |field|
          arel_table[field].matches("%#{sanitize_sql_like(query)}%")
        end.reduce(:or)

        result = result.where(search_conditions)
      end

      # Apply ordering
      result = result.order(order_by => order) if order_by.present? && order.present?

      # Apply offset
      result = result.offset(offset_val) if offset_val.positive?

      # Apply limit
      result = result.limit(limit_val) if limit_val.positive?

      result
    }

    scope :search, -> {
      joins(file_attachment: :blob).where(
        "record_attachments.title ILIKE :q OR active_storage_blobs.filename ILIKE :q OR record_attachments.description ILIKE :q",
        q: "%#{query}%"
      )
    }
  end
end
