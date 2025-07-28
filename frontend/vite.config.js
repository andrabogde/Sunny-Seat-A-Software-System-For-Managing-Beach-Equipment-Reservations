// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: [
//       'react', 
//       'react-dom', 
//       'lodash-es', 
//       'axios'
//     ],
//     exclude: [
//       '@tabler/icons-react',
//       'tabler-icons' // în caz că rămâne ceva prin dependințe indirecte
//     ]
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'lodash-es', 
      'axios'
    ],
    exclude: [
      '@tabler/icons-react',
      'tabler-icons' // în caz că rămâne ceva prin dependințe indirecte
    ]
  }
  // 🚫 PROXY DEZACTIVAT - folosim URL-uri absolute în cod
})