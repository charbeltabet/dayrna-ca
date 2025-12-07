class ReferencesController < ApplicationController
  def index
    # Get home page data for the navigation bar
    home_page_data = HomePageData.instance
    data = home_page_data.data.deep_dup
    data["navigations"] = Navigation.as_nested_tree

    # Get root navigations
    root_navigations = Navigation.roots.map(&:as_tree)

    breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Reference", href: nil }
    ]

    render inertia: "Reference/Index", props: {
      navigations: root_navigations,
      homePageData: data,
      breadcrumbs: breadcrumbs
    }
  end

  def show
    path = params[:path]

    # Get home page data for the navigation bar
    home_page_data = HomePageData.instance
    data = home_page_data.data.deep_dup
    data["navigations"] = Navigation.as_nested_tree

    # Remove leading/trailing slashes and split the path
    path_segments = path.split('/').reject(&:blank?)

    # Try to find the navigation or page by traversing the path
    result = find_by_path(path_segments)

    if result[:type] == 'navigation'
      navigation = result[:item]
      breadcrumbs = build_breadcrumbs_for_navigation(navigation)
      render inertia: "Reference/Show", props: {
        type: 'navigation',
        navigation: navigation.as_tree,
        homePageData: data,
        breadcrumbs: breadcrumbs
      }
    elsif result[:type] == 'page'
      page = result[:item]
      breadcrumbs = build_breadcrumbs_for_page(page)

      # Find next and previous pages in the same navigation
      sibling_pages = page.navigation.pages.order(:position)
      current_index = sibling_pages.index(page)

      previous_page = current_index && current_index > 0 ? sibling_pages[current_index - 1] : nil
      next_page = current_index && current_index < sibling_pages.length - 1 ? sibling_pages[current_index + 1] : nil

      render inertia: "Reference/Show", props: {
        type: 'page',
        page: page.as_json(methods: [ :full_path, :image_url, :text_preview ], include: { navigation: { only: [ :id, :name, :url ] } }),
        homePageData: data,
        breadcrumbs: breadcrumbs,
        nextPage: next_page&.as_json(only: [ :id, :title, :slug ], methods: [ :full_path ]),
        previousPage: previous_page&.as_json(only: [ :id, :title, :slug ], methods: [ :full_path ]),
        parentNavigation: page.navigation.as_json(only: [ :id, :name, :url ], methods: [ :full_path ])
      }
    else
      # For now, just render a 404-style page
      render inertia: "Reference/Show", props: {
        type: 'not_found',
        path: path,
        homePageData: data
      }
    end
  end

  private

  def find_by_path(path_segments)
    return { type: nil, item: nil } if path_segments.empty?

    # Start from root navigations
    current_navigation = nil
    remaining_segments = path_segments.dup

    # Traverse through navigations
    while remaining_segments.any?
      segment = remaining_segments.first

      if current_navigation.nil?
        # Look for root navigation
        nav = Navigation.roots.find_by(url: segment)
      else
        # Look for child navigation
        nav = current_navigation.children.find_by(url: segment)
      end

      if nav
        current_navigation = nav
        remaining_segments.shift
      else
        break
      end
    end

    # If we consumed all segments, we found a navigation
    if remaining_segments.empty? && current_navigation
      return { type: 'navigation', item: current_navigation }
    end

    # If there's exactly one segment left and we have a current navigation, try to find a page
    if remaining_segments.length == 1 && current_navigation
      page = current_navigation.pages.find_by(slug: remaining_segments.first)
      if page
        return { type: 'page', item: page }
      end
    end

    # Not found
    { type: nil, item: nil }
  end

  def build_breadcrumbs_for_navigation(navigation)
    breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Reference", href: "/reference" }
    ]

    # Collect parent navigations
    nav_chain = []
    current_nav = navigation
    while current_nav
      nav_chain.unshift(current_nav)
      current_nav = current_nav.parent
    end

    # Add all navigations to breadcrumbs (last one will be current, non-link)
    nav_chain.each_with_index do |nav, index|
      if index == nav_chain.length - 1
        # Last item is current navigation (no link)
        breadcrumbs << { label: nav.name, href: nil }
      else
        breadcrumbs << { label: nav.name, href: nav.full_path }
      end
    end

    breadcrumbs
  end

  def build_breadcrumbs_for_page(page)
    breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Reference", href: "/reference" }
    ]

    # Collect parent navigations
    nav_chain = []
    current_nav = page.navigation
    while current_nav
      nav_chain.unshift(current_nav)
      current_nav = current_nav.parent
    end

    # Add all navigations to breadcrumbs (all are links)
    nav_chain.each do |nav|
      breadcrumbs << { label: nav.name, href: nav.full_path }
    end

    # Add page as last item (non-link)
    breadcrumbs << { label: page.title, href: nil }

    breadcrumbs
  end
end
