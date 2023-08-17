document.querySelector("#navbar").innerHTML = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid d-flex align-items-center">
          <a class="navbar-brand fw-bold fs-3" href="#">Aromatica</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">Products</a>
              </li>
            </ul>
            <form class="d-flex me-auto" role="search">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button class="btn btn-outline-dark" type="submit">Search</button>
            </form>
            <ul class="navbar-nav mb-2 mb-lg-0 d-flex align-items-center">
              <li class="nav-item">
                <a href="" class="me-3"
                  ><i
                    class="fa-solid fa-cart-shopping"
                    style="color: #000000"
                  ></i
                ></a>
              </li>
              <li class="nav-item">
                <a href=""
                  ><i class="fa-regular fa-user" style="color: #000000"></i
                ></a>
              </li>

              <li class="nav-item">
                <button class="btn">log in</button>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-dark">sign up</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>`;
