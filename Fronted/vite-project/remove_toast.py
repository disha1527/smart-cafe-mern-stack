import pathlib

root = pathlib.Path(__file__).resolve().parent
files = [
    'src/App.jsx',
    'src/pages/Booking.jsx',
    'src/pages/admin/Admin Register.jsx',
    'src/pages/Register.jsx',
    'src/pages/Menu.jsx',
    'src/pages/Login.jsx',
    'src/pages/Checkout.jsx',
    'src/pages/Cart.jsx',
    'src/pages/admin/AddProduct.jsx',
    'src/pages/admin/EditProduct.jsx',
    'src/pages/admin/AdminMenu.jsx',
    'src/pages/admin/AdminLogin.jsx',
]

for rel in files:
    path = root / rel
    text = path.read_text(encoding='utf-8')
    original = text
    text = text.replace('import { ToastContainer } from "react-toastify";\n', '')
    text = text.replace('import "react-toastify/dist/ReactToastify.css";\n', '')
    text = text.replace('import { toast } from "react-toastify";\n', '')
    text = text.replace('import { toast } from "react-toastify";', '')
    text = text.replace('toast.error(', 'alert(')
    text = text.replace('toast.success(', 'alert(')
    text = text.replace('toast.warn(', 'alert(')
    text = text.replace('toast.info(', 'alert(')
    # remove ToastContainer component if present
    text = text.replace('<ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />\n', '')
    text = text.replace('<ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />', '')
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'Updated {rel}')
    else:
        print(f'No changes for {rel}')
