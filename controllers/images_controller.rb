class ImagesController < ApplicationController
  # load_and_authorize_resource
  def new
    @images = Image.order('created_at DESC')
    @image = Image.new
  end

  def new_multiple
    @images = Image.order('created_at DESC')
    @image = Image.new
  end

  def create
    # @image = Image.new(photo_params)
    # @image.save
    # redirect_to new_image_path

    respond_to do |format|
      @image = Image.new(image_params)
      @image.save
      format.html { redirect_to new_image_path }
      format.js
    end
  end

  private

  def image_params
    params.require(:image).permit(:image, :title)
  end
end