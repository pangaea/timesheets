# To change this template, choose Tools | Templates
# and open the template in the editor.

module ActionView::Helpers::AssetTagHelper
  #remove_const :JAVASCRIPT_DEFAULT_SOURCES
  JAVASCRIPT_DEFAULT_SOURCES = %w(jquery.js rails.js)

  reset_javascript_include_default
end

#ActionView::Helpers::AssetTagHelper::JAVASCRIPT_DEFAULT_SOURCES = %w{ jquery-1.4.min jquery-ui jquery.cookie }
#ActionView::Helpers::AssetTagHelper::reset_javascript_include_default