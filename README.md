# MARGEN

Sitio de una marca de ropa urbana hecha en la Ciudad de México. Marca, dirección de arte,
contenido y tienda creados desde cero para esta demostración.

- **Nombre:** MARGEN
- **Eslogan:** *Nada importante se escribió en el centro.*
- **Concepto:** el margen de una hoja es el único sitio donde se escribe algo honesto. De ahí
  salen el logotipo (una regla vertical), el rojo de corrección y el tono de voz.
- **Precios:** MXN · **Idioma:** es-MX

## Arrancar

```bash
npm install
npm run dev
```

`npm run build` compila, `npm run typecheck` corre TypeScript sin emitir.

> Detén el servidor de desarrollo antes de compilar: ambos escriben en `.next` y, si coinciden,
> el que está corriendo se queda con artefactos a medias.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · `motion` (animación) · `lenis`
(scroll suave). Sin dependencias de UI de terceros: todos los componentes son propios.

## Mapa del proyecto

```
src/
  app/                    Rutas (App Router)
    page.tsx              Portada
    tienda/               Catálogo con filtros, orden y búsqueda por URL
    producto/[slug]/      Ficha de producto
    drop/                 Serie vigente, contador y piezas restantes
    colecciones/[slug]/   Series
    lookbook/             Editorial con marcas comprables sobre la foto
    la-marca/             Historia, manifiesto y sistema de identidad
    checkout/             Compra completa + confirmación
    favoritos/ cuenta/    Guardados y acceso
  components/
    brand/                Logotipo, monograma y aplicaciones
    ui/                   Primitivas, iconos y vocabulario de movimiento
    home/ shop/ product/ cart/ search/ lookbook/ checkout/ drop/
  lib/
    types.ts              Modelo de dominio completo
    data/                 Marca, catálogo, productos, fototeca, lookbook
    repositories/         Única puerta de acceso a los datos
    store/                Carrito, favoritos y estado de paneles
    payments/             Adaptadores de cobro
    format.ts             Dinero y fechas en es-MX
```

## Dirección de arte

Toda la fotografía pasa por la clase `.ad-photo` (monocromo, contraste y brillo fijos) y por una
capa de grano. Es lo que mantiene unida una producción tomada en sitios distintos: el único color
del sitio es el rojo de la marca, y nunca aparece dentro de una imagen.

Las fotografías son material de referencia de Unsplash para el prototipo y viven todas en
`src/lib/data/media.ts`. Sustituir la producción real significa cambiar ese archivo y nada más.

## Datos y backend

El modelo (`src/lib/types.ts`) cubre `Product`, `Category`, `Collection`, `User`, `Order`, `CartItem`,
`InventoryEntry`, `Size`, `ColorOption`, `Coupon`, `ShippingMethod` y `PaymentMethod`, en campos
pensados para mapear 1:1 contra tablas SQL. **El dinero siempre se guarda en centavos MXN.**

La interfaz nunca lee los archivos de datos: pasa por `src/lib/repositories`. Migrar a Supabase es
reescribir el cuerpo de esas funciones:

```ts
export async function queryProducts(query: ProductQuery) {
  const { data } = await supabase
    .from("products")
    .select("*, colors(*), inventory(*)")
    .in("category_id", query.categories ?? []);
  return data.map(toProduct);
}
```

Tablas sugeridas: `products`, `product_colors`, `inventory`, `categories`, `collections`, `users`,
`addresses`, `orders`, `order_items`, `coupons`, `shipping_methods`. RLS: lectura pública de
catálogo; `orders` y `addresses` sólo para su dueño o para el rol `staff`.

### Pagos

`src/lib/payments` expone un único `createPaymentIntent(payload)` y tres adaptadores
(`tarjeta` → Stripe, `mercadopago`, `paypal`). Hoy devuelven una referencia simulada; en producción
cada uno llama a su endpoint en `/api/checkout/*`. El checkout no conoce a ningún proveedor.

## Panel de administración (siguiente paso)

La arquitectura ya lo admite sin tocar la tienda:

- **Rutas:** `app/admin/` con layout propio y guard por `User.role` (`staff` | `admin`).
- **Escritura:** añadir a `repositories` las operaciones `createProduct`, `updateProduct`,
  `deleteProduct`, `setStock`, `createCollection`, `updateOrderStatus`.
- **Stock:** ya está normalizado por talla y color en `InventoryEntry`; el panel edita esa tabla.
- **Pedidos:** `OrderStatus` y `ORDER_STATUS_FLOW` definen los estados —pendiente, pagado,
  preparando, enviado, entregado, cancelado— y el orden en que avanzan.
- **Hoy:** las existencias se generan de forma determinista en `data/products.ts`; esa función
  desaparece en cuanto la tabla `inventory` sea real.

## Detalles de la experiencia

Pantalla de carga sólo en la primera visita de la sesión · cursor de marca en escritorio ·
transición entre páginas · revelado de fotografía por máscara · paralaje contenido · cambio de
imagen al pasar el cursor sobre un producto · carrito lateral con barra de envío gratis ·
buscador a pantalla completa en tiempo real · recomendador de talla a partir de estatura, peso y
preferencia de ajuste · marcas comprables sobre las fotos del lookbook.

Todo el movimiento se apaga con `prefers-reduced-motion`.
