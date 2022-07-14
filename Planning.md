## MVP 1

-   [x] client server working
-   can move ship
-   Visuals
    -   ship (temp sprite)
    -   vision + fog

### Visuals

#### ship

triangle

#### vision + fog

webgl
texture
vision area is BRIGHTER. Fog area is DARKER

How the layering works:

1. draw `normal background` on null/main framebuffer
2. draw ship on null/main framebuffer
3. create a `lighting framebuffer`
4. render the `darkened background` on `lighting framebuffer`
5. cut "holes" in the `lighting framebuffer` (probe vision)
6. draw `lighting framebuffer` on the null/main framebuffer

#### Current plan for achieving visuals

1. textures and framebuffers
2. drawing one framebuffer on top of another
    1. use the above plan

#### Random notes

-   maybe use `image-rendering` css property to blur the antialiasing?

## MVP 2

-   multiplayer works
-   scrolling
-   only show enemy units when in range of <- yuki prevents hacks
-   probes works

# Forgot

-   remember to always bind before buffer data
