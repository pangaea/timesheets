class HomeController < ApplicationController
    before_filter :ensure_login

    def index
    end

end
