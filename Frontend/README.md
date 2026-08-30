# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

react have 4 layer architacure

UI=> //design management
=>component, 
=>pages 

state=> data store //this layer is used fro loading and user 
=>auth.context.jsx
=>ai.context.jsx

api => for communication with backend 
=>services
  =>auth.api.js

//according to lecture isne 
useEffect(()=>{
        const getAndSetUser = async()=>{
            const data = await getMe()
            setUser(data.user)
            setLoading(false)
        }
        getAndSetUser()
    },[]) ye code in hooks me use kiya hiaa but mene auth.context me use kiya hia
    