class Api::WatchlistsController < ApplicationController 

  def create
    watchlist = Watchlist.new(watchlist_params)
    @user = current_user
    watchlist.user_id = current_user.id
    if watchlist.save
      render "api/users/show"
    else
      render json: @watchlist.errors.full_messages
    end
  end

  def destroy
    watchlists = Watchlist.where(user_id: current_user.id)
    watchlist = watchlists.find_by(ticker_symbol: params[:ticker_symbol])
    @user = current_user
    if watchlist.destroy
      render "api/users/show"
    else
      render json: ["could not complete action"], status: 422
    end
  end

  private

  def watchlist_params
    params.require(:watchlist).permit(:ticker_symbol)
  end
end