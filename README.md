# Trucksim Completionist

Trucksim Completionist is a [single-page application](https://en.wikipedia.org/wiki/Single-page_application) dedicated to tracking the completion of achievements for [SCS Software](https://www.scssoft.com/)'s [American Truck Simulator](https://www.scssoft.com/projects/american-truck-simulator) and [Euro Truck Simulator 2](https://www.scssoft.com/projects/euro-truck-simulator-2).

Both games come with a set of [achievements](https://trucksimulator.wiki.gg/wiki/Achievements), where the player finishes a set of tasks. Such tasks include, but are not limited to, delivering a specific cargo type to a depot, or fulfilling a supply chain. Helpful information is provided to the player in completing the task, such as the appropriate trailer type to use, or the companies to deliver to. As such, this website is designed for the player to not only track their progress, but see information that helps them towards completing their achievements.

Progress can be tracked locally using the [browser storage](https://en.wikipedia.org/wiki/Web_storage), or players can sign up to keep their progress saved. With signing in, users can use the application on multiple devices. User management and authentication is provided by [Google Firebase Auth](https://firebase.google.com/products/auth). Players are strongly recommended to sign up for an account and utilize that to track their progress, as browser storage may be **lost** between data corruptions, clean installs, browser storage reset, and so forth.

## Technologies Used
- [React](https://react.dev/) - Front-end framework used to build user interfaces
- [Vite](https://vitejs.dev/) - Dev environment used to speed up development and provides out-of-the-box building tools
- [Express](https://expressjs.com/) - Back-end framework used to respond to user query and mutations
- [Google Firebase Auth](https://firebase.google.com/docs/auth) - User management and authentication