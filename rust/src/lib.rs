use leptos::*;
use wasm_bindgen::prelude::*;

/// A simple counter component.
///
/// You can use doc comments like this to document your component.
#[component]
pub fn SimpleCounter(
    cx: Scope,
    /// The starting value for the counter
    initial_value: i32,
    /// The change that should be applied each time the button is clicked.
    step: i32,
) -> impl IntoView {
    let (value, set_value) = create_signal(cx, initial_value);

    view! { cx,
        <div class="flex items-center">
            <button on:click=move |_| set_value(0) class="border rounded bg-red-500 text-white p-2 m-2">"X"</button>
            <button on:click=move |_| set_value.update(|value| *value -= step)>
                <div class="w-16 h-auto p-1 m-1">
                    <img src="./decrease.png" width="100%" />
                </div>
            </button>
            <span>"Value: " {value} "!"</span>
            <button on:click=move |_| set_value.update(|value| *value += step)>
                <img src="./increase.png" class="w-16 h-auto p-1 m-1" width="100%" />
            </button>
        </div>
    }
}

// Let bindgen mount the component to the DOM body for us
#[wasm_bindgen(start)]
pub fn main_js() {
    _ = console_log::init_with_level(log::Level::Debug);
    console_error_panic_hook::set_once();
    mount_to_body(|cx| {
        view! { cx,
            <SimpleCounter
                initial_value=0
                step=1
            />
        }
    })
}
