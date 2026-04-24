# Trucksim Completionist

Trucksim Completionist is a [single-page application](https://en.wikipedia.org/wiki/Single-page_application) dedicated to tracking the completion of achievements for [SCS Software](https://www.scssoft.com/)'s [American Truck Simulator](https://www.scssoft.com/projects/american-truck-simulator) and [Euro Truck Simulator 2](https://www.scssoft.com/projects/euro-truck-simulator-2).

Both games come with a set of [achievements](https://trucksimulator.wiki.gg/wiki/Achievements), where the player finishes a set of tasks. Such tasks include, but are not limited to, delivering a specific cargo type to a depot, or fulfilling a supply chain. Helpful information is provided to the player in completing the task, such as the appropriate trailer type to use, or the companies to deliver to. As such, this website is designed for the player to not only track their progress, but see information that helps them towards completing their achievements.

Progress can be tracked locally using the [browser storage](https://en.wikipedia.org/wiki/Web_storage), or players can sign up to keep their progress saved. With signing in, users can use the application on multiple devices. User management and authentication is provided by [Supabase](https://supabase.com/auth). Players are strongly recommended to sign up for an account and utilize that to track their progress, as browser storage may be **lost** between data corruptions, clean installs, browser storage reset, and so forth.

## Technologies Used
- [React](https://react.dev/) - Front-end framework used to build user interfaces
- [Vite](https://vitejs.dev/) - Dev environment used to speed up development and provides out-of-the-box building tools
- [Express](https://expressjs.com/) - Back-end framework used to respond to user query and mutations
- [Supabase](https://supabase.com/) - User authentication and PostgreSQL data persistence

## Setup

All commands provided within these steps, otherwise indicated, are to be executed with the current working directory on the project root, aka where this `README.md` is located.

1. Ensure that [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) (at least v2.93.0) and [Node 24 with npm](https://nodejs.org/en/download/current) is installed.
2. Execute the following commands to generate a signing key to use JWKS.
```shell
echo "[]" > supabase/signing_key.json
supabase gen signing-key --algorithm ES256 --yes
```
3. Start the local Supabase instance with `supabase start`.
4. Install the dependencies for the project using `npm ci`.
5. Build the common package using `npm run build --workspace common`.
6. From the `frontend/` folder, install the playwright dependencies by executing `npx playwright install --with-deps`.
7. Execute `npm run setup`, which will copy the achievement data from the `common` folder to the `frontend` public static assets folder.
8. Retrieve the Database URL from `supabase status`. Fill it into the blank and execute to create the local infomanager and webserver users so the application can connect to the database.
```shell
psql "<connection_string>" -f create_users.sql
```
9. Configure your development environment with the proper environment variables, using the environment variable template files in the project root. You should only need `.env.development.local` and `.env.test.local`.


Your local copy should now be ready.