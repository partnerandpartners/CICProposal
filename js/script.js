/* global jQuery, Howl */

(function ($) {
  $(document).ready(function () {
    // Slick carousels
    $('.slick').slick({
      dots: true,
      adaptiveHeight: false,
      autoplay: true,
      arrows: false
    })

    // How many img tags don't have width & height?
    // console.log($('img:noth([width]):not([height])').length)

    function closeAllModals () {
      $('body').removeClass('modal-open')
      $('.modal.active').removeClass('active')
    }

    // Modal opening buttons
    $(document).on('click', '.modal-link', function (e) {
      e.preventDefault()
      var targetSelector = $(this).attr('data-target')

      if (!targetSelector) {
        return
      }

      if ($('body').hasClass('modal-open')) {
        $('.modal.active').removeClass('active')
      }

      $(targetSelector).addClass('active')
      $('body').addClass('modal-open')
    })

    // When a user clicks on something inside the modal's content area,
    // prevent the event from propagating so that the .modal container
    // doesn't receive the click event, because then the modal would close.
    $(document).on('click', '.modal-content', function (e) {
      e.stopPropagation()
    })

    // Close modal buttons
    $(document).on('click', '.close-modal', function (e) {
      e.preventDefault()
      closeAllModals()
    })

    // Allow the user to click the overlay behind a modal to close it
    // so that they don't have to click a close button
    $(document).on('click', '.modal', function (e) {
      closeAllModals()
    })

    // Audio
    var sound = false
    $(document).on('click', 'button.audio-player', function (e) {
      e.preventDefault()
      let url = $(this).attr('data-audio-url')
      if ($(this).hasClass('playing')) {
        sound.pause()
        $(this).removeClass('playing')
      } else {
        $('button.audio-player.playing').removeClass('playing')
        $(this).addClass('playing')
        if (url) {
          if (sound) {
            sound.unload()
          }
          sound = new Howl({src: [url]})
          sound.play()
        }
      }
    })

    // Mobile Menu
    $(document).on('click', 'a.menu-toggle', function (e) {
      e.preventDefault()
      $('body').toggleClass('menu-open')
    })

    // Close the mobile menu when someone clicks a mobile menu link
    $(document).on('click', '#nav ul a', function (e) {
      $('body').removeClass('menu-open')
    })

    // Close the menu if it's open on a mobile-size viewport and then
    // the user resizes their window so that it's no longer mobile. So that
    // if the user resizes their window back to a mobile size, the menu
    // isn't still open.
    $(window).on('resize', function (e) {
      if ($('body').hasClass('menu-open')) {
        if ($(window).outerWidth() > 768) {
          $('body').removeClass('menu-open')
        }
      }
    })

    // Show a single taxonomy
    $(document).on('click', 'a.show-taxonomy', function (e) {
      e.preventDefault()

      $(this).closest('.tax-row').toggleClass('active')

      if ($(this).closest('.dotted').find('.tax-row.active').length > 0) {
        $(this).closest('.dotted').addClass('active')
      } else {
        $(this).closest('.dotted').removeClass('active')
      }

      if ($(this).closest('.dotted').find('.tax-row:not(.active)').length == 0) {
        $(this).closest('.dotted').addClass('all-active')
      } else {
        $(this).closest('.dotted').removeClass('all-active')
      }
    })

    // Show all taxonomies
    $(document).on('click', 'a.show-all-taxonomies', function (e) {
      e.preventDefault()

      if ($(this).closest('.dotted').hasClass('all-active')) {
        // Close all taxonomies
        $(this).closest('.dotted').find('.tax-row').removeClass('active')
        $(this).closest('.dotted').removeClass('active')
        $(this).closest('.dotted').removeClass('all-active')
      } else {
        // Open all taxonomies
        $(this).closest('.dotted').find('.tax-row').addClass('active')
        $(this).closest('.dotted').addClass('active')
        $(this).closest('.dotted').addClass('all-active')
      }
    })

    $('#mc-embedded-subscribe-form').formchimp()

    function scrollToTopToggle () {
      if ($('body').scrollTop() > 500) {
        $('button.back-to-top').addClass('visible')
      } else {
        $('button.back-to-top').removeClass('visible')
      }
    }

    scrollToTopToggle()

    $(document).on('click', 'button.back-to-top', function(e){
      e.preventDefault()
      $(document).scrollTop(0)
    })

    $(window).scroll(scrollToTopToggle)

    // Get involved contact form handler
    // $(document).on('submit', 'form#get-involved-form', function (e) {
    //   e.preventDefault()
    //   console.log($(this).serialize())
    // })

    // Party Mode....Shhh!


  })
})(jQuery)
