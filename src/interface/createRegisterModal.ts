export default function () {
    const modalHtml = `
          <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Register</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
          <form id="register-form">
              <div class="mb-3">
              <label for="email" class="col-form-label">Email:</label>
              <input type="email" class="form-control" id="email">
              </div>
              <div class="mb-3">
              <label for="username" class="col-form-label">Username:</label>
              <input type="username" class="form-control" id="username">
              </div>
              <div class="mb-3">
              <label for="password" class="col-form-label">Password:</label>
              <input type="password" class="form-control" id="password">
              </div>
  
           <button type="submit" class="btn btn-primary" id="register">Register</button>
          </form>
          </div>
      `;
    return modalHtml;
  }
  