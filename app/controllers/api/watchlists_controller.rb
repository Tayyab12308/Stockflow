class Api::WatchlistsController < ApplicationController 

  def create
    @watchlist = Watchlist.new(watchlist_params)
    @watchlist.user_id = current_user.id
    if @watchlist.save
      render json: ["added to watchlist"]
    else
      render json: @watchlist.errors.full_messages
    end
  end

  def destroy
    watchlists = Watchlist.where(user_id: current_user)
    @watchlist = watchlists.find(ticker_symbol: watchlist_params)
    if @watchlist.destroy
      render json: ["removed from watchlist"]
    else
      render json: ["could not complete action"], status: 422
    end
  end

  private

  def watchlist_params
    params.require(:watchlist).permit(:ticker_symbol)
  end
end