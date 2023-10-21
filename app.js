class Producto {
	constructor(id, nombre, precio, categoria, imagen) {
		this.id = id
		this.nombre = nombre
		this.precio = precio
		this.categoria = categoria
		this.imagen = imagen
	}
}
class BaseDeDatos {
	constructor() {
		this.productos = []
		this.cargarRegistros()
	}

	traerRegistro() {
		return this.productos
	}

	async cargarRegistros() {
		const resultado = await fetch('./productos.json')
		this.productos = await resultado.json()
		cargarProductos(this.productos)
	}

	registroPorId(id) {
		return this.productos.find((producto) => producto.id === id)
	}

	registrosPorNombre(palabra) {
		return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra.toLowerCase()))
	}
	registrosPorCategoria(categoria) {
		return this.productos.filter((producto) => producto.categoria == categoria)
	}
}

class Carrito {
	constructor() {
		const carritoStorage = JSON.parse(localStorage.getItem('carrito'))
		this.carrito = carritoStorage || []
		this.total = 0
		this.cantidadProductos = 0
		this.divCarrito = divCarrito
		this.listar()
	}

	inCarrito({ id }) {
		return this.carrito.find((producto) => producto.id === id)
	}

	agregar(producto) {
		const productoEnCarrito = this.inCarrito(producto)
		if (!productoEnCarrito) {
			this.carrito.push({ ...producto, cantidad: 1 })
		} else {
			productoEnCarrito.cantidad++
		}
		localStorage.setItem('carrito', JSON.stringify(this.carrito))

		this.listar()
	}

	quitar(id) {
		const indice = this.carrito.findIndex((producto) => producto.id === id)
		if (this.carrito[indice].cantidad > 1) {
			this.carrito[indice].cantidad--
		} else {
			this.carrito.splice(indice, 1)
		}

		localStorage.setItem('carrito', JSON.stringify(this.carrito))
		this.listar()
	}

	listar() {
		this.total = 0
		this.cantidadProductos = 0
		this.divCarrito.innerHTML = ''

		for (const producto of this.carrito) {
			divCarrito.innerHTML += ` 
      <div class="productoCarrito text-center">
      <h2 class="border-bottom border-info-subtle border-4">${producto.nombre}</h2>
      <p>$${producto.precio}</p>
      <p>額:${producto.cantidad}</p>
      <button href="#" class="btnQuitar" data-id="${producto.id}"><img src="img/trash3.svg" /></button>
      </div>
      `
			this.total += producto.precio * producto.cantidad
			this.cantidadProductos += producto.cantidad
		}
		if (this.cantidadProductos > 0) {
			btnComprar.style.display = ''
		} else {
			btnComprar.style.display = 'none'
		}

		const botonesQuitar = document.querySelectorAll('.btnQuitar')
		for (const boton of botonesQuitar) {
			boton.addEventListener('click', (event) => {
				event.preventDefault()
				const idProducto = +boton.dataset.id
				this.quitar(idProducto)
			})
		}
		spanCantidadProductos.innerText = this.cantidadProductos
		spanTotalCarrito.innerText = this.total
	}
}

const db = new BaseDeDatos()

const spanCantidadProductos = document.querySelector('#cantidadProductos')
const spanTotalCarrito = document.querySelector('#totalCarrito')
const divProductos = document.querySelector('#productos')
const divCarrito = document.querySelector('#carrito')
const inputBuscar = document.querySelector('#inputBuscar')
const btnComprar = document.querySelector('.btnComprar')
const btnCategorias = document.querySelectorAll('.btnCategoria')
const imgCarrito = document.querySelector('.imagen-carrito')

btnCategorias.forEach((btn) => {
	btn.addEventListener('click', () => {
		const categoria = btn.dataset.categoria

		btnCategorias.forEach((boton) => {
			boton.classList.remove('active')
		})

		btn.classList.add('active')

		if (categoria == 'Todos') {
			cargarProductos(db.traerRegistro())
		} else {
			cargarProductos(db.registrosPorCategoria(categoria))
		}

		const productos = db.registrosPorCategoria(btn.dataset.categoria)
	})
})

const carrito = new Carrito()

cargarProductos(db.traerRegistro())

function cargarProductos(productos) {
	divProductos.innerHTML = ''
	// Acaa podemos meter la clase CARD de boostrap
	for (const producto of productos) {
		divProductos.innerHTML += ` 
		
  		<div class="col">	
					<div class="card producto bg-light.bg-gradient">
						<img src="img/${producto.imagen}" class="card-img-top" alt="Imagen del Producto">
						<div class="card-body">
							<h5 class="card-title">${producto.nombre}</h5>
							<p class="card-text precio">$${producto.precio}</p>
								<button type="button" href="#" class="btn btn-primary btnAgregar"data-id="${producto.id}">今すぐ購入</button>
  					</div>
				</div>
  		</div>
		
    `
	}

	const botonesAgregar = document.querySelectorAll('.btnAgregar')

	for (const boton of botonesAgregar) {
		boton.addEventListener('click', (event) => {
			event.preventDefault()
			const idProducto = +boton.dataset.id
			const producto = db.registroPorId(idProducto)
			carrito.agregar(producto)
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: '要素が正常に追加されました',
				showConfirmButton: false,
				timer: 1000,
			})
		})
	}
}

inputBuscar.addEventListener('input', (event) => {
	event.preventDefault()
	const palabra = inputBuscar.value
	const productos = db.registrosPorNombre(palabra)
	cargarProductos(productos)
})

btnComprar.addEventListener('click', (event) => {
	event.preventDefault()
	Swal.fire({
		title: '二度と来ないでください',
		width: 400,
		padding: '1rem',
		background: 'url(/img/vision.png) no-repeat center',
		backdrop: `
    rgba(0,0,123,0.4)
    url(/img/MONEY.png)
    center
    no-repeat
  `,
	})
})
