import math
from PIL import Image

outwidth = 64

img = Image.open('images/mandrill.png')
width, height = img.size

outheight = int(math.ceil(width * height) / outwidth)
out = Image.new('RGB', (outwidth, outheight), "black")
pixels = img.getdata()
outpixels = out.load()  # create the pixel map
for i in xrange(len(pixels)):
    x = i % outwidth
    y = int(math.floor(i / outwidth))
    outpixels[x, y] = pixels[i]

print (outwidth, outheight)
out.show()
