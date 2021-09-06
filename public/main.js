// Initial data passed to Elm (should match `Flags` defined in `Shared.elm`)
// https://guide.elm-lang.org/interop/flags.html
var flags = null

// Start our Elm application
var app = Elm.Main.init({ flags: flags })

// Ports go here
// https://guide.elm-lang.org/interop/ports.html
app.ports.setCustomProperty.subscribe(function([name, value]) {
    // have to do this with a port, as styles set through Elm won't set custom
    // properties: https://discourse.elm-lang.org/t/css-custom-properties/5554
    // (and I don't have access to the body element in Elm anyway)
    document.body.style.setProperty("--" + name, value);
});