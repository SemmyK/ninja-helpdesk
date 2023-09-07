# NEXT.js 13

## CLIENT COMPONENTS

- hydrated(made interactive) in the browser
- used for:

* components that have interactivity or event listeners, useState and lifecycle events(react build in hooks), browser only API,
* for components that use custom hooks that depend on state , effects or browser only API
* for react class components

- rendered on server hydrated in browser
- interactive
- tell next js that component is client component by putting 'use client' on top of file as first line of component file (that means component will use state and effects and events)

## SERVER COMPONENTS

- components that live on server and don't need to be hydrated in the browser, usually async
- smaller JS bundle size
- used for:

  - fetch data,
  - accessing backend resurces(directly)
  - for code that uses sensitive info (API keys, tokens...) because they are hidden from the client side and
  - when we need to use large dependencies

- rendered on server don't need for hydration in browser
- they are not interactive
- by default all components start as server component we need to specify which components will be client component that have interactivity, we use server components if component is containing static data

### Rendering

Rendering converts the code you write into user interfaces. React and Next.js allow you to create hybrid web applications where parts of your code can be rendered on the server or the client.

#### client-side rendering

- content is rendered in browser with JS
- not good for SEO
- can lead to performance issues

#### server-side rendering

- rendering on the server
- sending smaller JS to the browser for hydration
- good for SEO
- better performance

## APP directory

- all pages and components directory - client and server side components
- using app router

## Streaming content to the browser using suspence boundaries

- allowing us to show loading message only on part of the screen(component) that is fetching the data, the rest of the page is fully loaded, it can be achieved by wrapping loading.jsx component into Suspence component which is build in
- suspence boundary only wraps pages so our layout component content is fully rendered while we are fetching data

## simplified fetching with async/await

- since next js components are by default server components we can put server functionality in any of them without worring that it will run in the browser
- if our server component should fetch data or do other task that is time consuming we make it async
- recommended to make async function that is fetching data out of the component and just call it inside async component
- by default Next.js does 2 things when fetching:

  - if we are fetching same data on more places in app the fetch will be done only once and stored for each use
  - cashes the response for each response so if we leave the page and return back to it we get cashed data displayed

- cashing can be modified with settings adding settings object as second argument to fetch where we define how often next will revalidate cashed data and make a new request:
  -- revalidating after 30 sec

  ```nextflow

   const getData = async () => {
  	try {
  		const res = await fetch('http://localhost:4000/tickets', {
  			next: {
  				revalidate: 30,
  			},
  		})

  		const data = await res.json()
  		return data
  	} catch (error) {
  		console.log(error)
  	}
  }

  ```

- set up **revalidate: 0** to prevent caching data and to make next fetching data every time it's needed

## static rendering vs dynamic rendering

- serving up data and pages from cached memory whenever is possible to improve performance, pages are rendered before build time into html documents and distributed to a CDN and served up quickly when they are requested (serving pre-rendered pages is faster) - static rendering (static site generation)
- **revalidate: 0** prevents static rendering because next.js can not save anything in cache so this is the set up for fetching if we want to have dynamic rendering (if data is often changed)
- when pages need to be served only upon request if data that they use is changed often - dynamic rendering

- static rendering is better option because of app performance and we can tell next js all possible dynamic routes with function generateStaticParams() so that during the build it can create all static pages for each dynamic route and have it ready

## server actions

- Next.js integrates with React Actions to provide a built-in solution for server mutations. In React with Redux, actions are plain JavaScript objects that have a type and optional payload field. As mentioned earlier, you can think of an action as an event that describes something that happened in the application.
- Server Actions can be defined in two places:

  - Inside the component that uses it (Server Components only).
  - In a separate file (Client and Server Components), for reusability. You can define multiple Server Actions in a single file.

## route handlers

- Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs. Route Handlers are only available inside the app directory.
- Route Handlers are defined in a **route.jsx|js|ts** file inside the app directory
- The following HTTP methods are supported: GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS. If an unsupported method is called, Next.js will return a 405 Method Not Allowed response.

**Dynamic segment of the route**

- creating dynamic route pages with folders called: [id] //or whatever dynamic param you have,
- inside of that folder we put page.jsx file that will be displayed, component that is in this page.jsx file takes params as argument and we can acces the parameter that we need from that params object

## image component

- The Image Component requires the following properties: src, width, height, and alt
- loader attribute - A custom function used to resolve image URLs. A loader is a function returning a URL string for the image, given the following parameters:

  - src
  - width
  - quality

  **Example**

  ```nextflow

  const imageLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
  }

  ```

## link components

- React component that extends the HTML <a> element to provide prefetching and client-side navigation between routes. It is the primary way to navigate between routes in Next.js.
- href prop is required
- useSelectedLayoutSegment is a Client Component hook that lets you read the active route segment one level below the Layout it is called from. You can use useSelectedLayoutSegment to create an active link component that changes style depending on the active segment.
  **Example**

```
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

// This *client* component will be imported into a blog layout
export default function BlogNavLink({ slug, children }) {
  // Navigating to `/blog/hello-world` will return 'hello-world'
  // for the selected layout segment
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      // Change style depending on whether the link is active
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}

```

## fonts

- easy way to import and use fonts from next/font/google
- next/font includes built-in automatic self-hosting for any font file. This means you can optimally load web fonts with zero layout shift, thanks to the underlying CSS size-adjust property used.
- This new font system also allows you to conveniently use all Google Fonts with performance and privacy in mind. CSS and font files are downloaded at build time and self-hosted with the rest of your static assets. No requests are sent to Google by the browser.

## folder and file structure

- node_modules - folder for dependencies
- public - folder for all files we want to make public on a website (images, static assets ), they will be awailable at the root of the domain
- app - folder for all app code (pages, components, stylesheets and route handlers), contains:
  - page.jsx - homepage for the app
  - layout.jsx - used for content that needs to be on each page (navs, footers) and then we just wrap all components with layout insted of adding that content to each page individually
  - not-found.jsx - used for page that will be shown for any 404 error (it can be scoped to be different for each page just if we create new not-found.jsx files in folders for other pages)
  - loading.jsx - will be shown for any loading by default, but we can also define it as fallback attribute for Suspence component to show loading only for parts of page that is loading data not for the whole page

### Routing

- all pages are put in folders with the name for the page and all have folder page.js/page.jsx
- if we want nested routes we nest folders in folders but still making page.jsx in each folder

### Style

- with globals.css
- with modules.css files
- tailwind build-in

### build

- building application
- next build generates an optimized version of your application for production.
- All JavaScript code inside folder **.next** has been compiled and browser bundles have been minified to help achieve the best performance and support all modern browsers.
