Netlify deployment 404 fix (current version Next 15.3)

npm install @netlify/plugin-nextjs
create netlify.toml with:

[build]
command = "npm run build"
publish = ".next"

[[plugins]]
package = "@netlify/plugin-nextjs"

[[redirects]]
from = "/\*"
to = "/index.html"
status = 200

ensure

I made sure my package.json has:

"scripts": {
"build": "next build"
}

found here
https://answers.netlify.com/t/page-not-found-error-404/118645/6

without TOML for redirects can use this method:
https://dev.to/rajeshroyal/page-not-found-error-on-netlify-reactjs-react-router-solved-43oa

Using Grommet and styled components with Next to avoid style flashing

wrap Grommet (and all inside) with the StyleSheetManager component (see in ThemeProvider)
