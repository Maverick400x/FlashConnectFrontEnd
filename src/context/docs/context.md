# React Authentication

**This document explains a simple, self-contained React authentication context that uses** `<span class="selected">localStorage</span>` **to persist the user's login state. It's a great starting point for a small application that needs basic user session management without a backend.**

### `AuthContext`

`<span class="selected">AuthContext</span>`

**The** `<span class="selected">AuthContext</span>` **is created with** `<span class="selected">createContext()</span>`. This is the core of React's Context API. It allows you to pass data through the component tree without having to manually pass props down at every level. The context holds the authentication state (`<span class="selected">user</span>`), and the functions to modify that state (`<span class="selected">login</span>` **and** `<span class="selected">logout</span>`).

### `AuthProvider`

`<span class="selected">AuthProvider</span>`

**The** `<span class="selected">AuthProvider</span>` **component is a wrapper that you will place around the part of your application that needs access to the authentication state.**

* **State Management:** **It uses the** `<span class="selected">useState</span>` **hook to manage the** `<span class="selected">user</span>` **object. The initial state is set by checking** `<span class="selected">localStorage</span>` **to see if a user is already logged in. This ensures the user remains logged in even after refreshing the page.**
* **Login Function:** **The** `<span class="selected">login</span>` **function takes a** `<span class="selected">userData</span>` **object, saves it to** `<span class="selected">localStorage</span>`, and updates the component's state.
* **Logout Function:** **The** `<span class="selected">logout</span>` **function clears the user's data from** `<span class="selected">localStorage</span>` **and sets the** `<span class="selected">user</span>` **state back to** `<span class="selected">null</span>`.
* **`<span class="selected">useEffect</span>` **Hook:**** **This hook is essential for a component-based app that needs to check if a user is already logged in after the component mounts.**

### `useAuth`

`<span class="selected">useAuth</span>`

**The** `<span class="selected">useAuth</span>` **custom hook provides a clean way to access the authentication context from any component wrapped by the** `<span class="selected">AuthProvider</span>`. By calling** **`<span class="selected">useContext(AuthContext)</span>` **inside a custom hook, you can keep your components clean and focused on their own logic.**
