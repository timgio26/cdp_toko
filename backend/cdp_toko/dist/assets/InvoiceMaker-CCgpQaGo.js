import{r as c,Y as E,j as e,O as D,T as $,Z as O,_ as A,a as L,$ as Q,C as U,a0 as G,U as v,K as H,a1 as K,F as V,a2 as W,a3 as Y}from"./index-DWYr6O-K.js";import{P as Z}from"./ProductSearchSelect-D534IQIr.js";import{u as B}from"./utilsHook-ByR4y5Ol.js";import"./inventoryQuery-EbIjJNZk.js";function J({value:d,onChange:l,disabled:x=!1}){const[s,u]=c.useState(""),[o,h]=c.useState(!1),g=c.useRef(null),y=B(s,300),{data:i,isPending:j,isError:p}=E(1,y),b=i==null?void 0:i.data.find(a=>a.id===d);c.useEffect(()=>{function a(S){g.current&&!g.current.contains(S.target)&&h(!1)}return document.addEventListener("mousedown",a),()=>{document.removeEventListener("mousedown",a)}},[]);const f=a=>{l(a),u(""),h(!1)},C=()=>{u(""),h(!0)};return e.jsx("div",{ref:g,className:"relative",children:d&&b?e.jsxs("div",{className:"flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5",children:[e.jsxs("div",{className:"flex min-w-0 items-center gap-3",children:[e.jsx("div",{className:"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600",children:e.jsx(D,{size:15})}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"truncate text-sm font-medium text-slate-900",children:b.name}),e.jsxs("p",{className:"mt-0.5 truncate text-xs text-slate-400",children:[b.phone||"No phone",b.email?` · ${b.email}`:""]})]})]}),e.jsx("button",{type:"button",onClick:C,disabled:x,className:`\r
              ml-3\r
              shrink-0\r
              text-xs\r
              font-medium\r
              text-slate-400\r
              transition\r
              hover:text-slate-700\r
              disabled:cursor-not-allowed\r
              disabled:opacity-50\r
            `,children:"Change"})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative",children:[e.jsx($,{size:17,className:`\r
                absolute\r
                left-3\r
                top-1/2\r
                -translate-y-1/2\r
                text-slate-400\r
              `}),e.jsx("input",{type:"text",value:s,disabled:x,onFocus:()=>h(!0),onChange:a=>{u(a.target.value),h(!0)},placeholder:"Search customer by name or phone...",className:`\r
                w-full\r
                rounded-lg\r
                border\r
                border-slate-200\r
                bg-white\r
                py-2.5\r
                pl-10\r
                pr-10\r
                text-sm\r
                text-slate-700\r
                outline-none\r
                transition\r
                placeholder:text-slate-400\r
                focus:border-slate-400\r
                focus:ring-2\r
                focus:ring-slate-100\r
                disabled:cursor-not-allowed\r
                disabled:bg-slate-50\r
              `}),e.jsx(O,{size:17,className:`
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
                transition
                ${o?"rotate-180":""}
              `})]}),o&&e.jsxs("div",{className:`\r
                absolute\r
                left-0\r
                right-0\r
                top-full\r
                z-50\r
                mt-1\r
                overflow-hidden\r
                rounded-lg\r
                border\r
                border-slate-200\r
                bg-white\r
                shadow-lg\r
              `,children:[!s.trim()&&e.jsx("div",{className:"px-4 py-4 text-center text-xs text-slate-400",children:"Type at least 2 characters to search."}),s.trim().length===1&&e.jsx("div",{className:"px-4 py-4 text-center text-xs text-slate-400",children:"Type at least 2 characters to search."}),s.trim().length>=2&&j&&e.jsxs("div",{className:"flex items-center justify-center gap-2 px-4 py-4 text-xs text-slate-400",children:[e.jsx("span",{className:`\r
                      h-4\r
                      w-4\r
                      animate-spin\r
                      rounded-full\r
                      border-2\r
                      border-slate-200\r
                      border-t-slate-700\r
                    `}),"Searching customers..."]}),s.trim().length>=2&&p&&!j&&e.jsx("div",{className:"px-4 py-4 text-center text-xs text-red-500",children:"Unable to search customers."}),s.trim().length>=2&&!j&&!p&&(i==null?void 0:i.data.length)===0&&e.jsx("div",{className:"px-4 py-4 text-center text-xs text-slate-400",children:"No customers found."}),!j&&!p&&i&&i.data.length>0&&e.jsx("div",{className:"max-h-64 overflow-y-auto py-1",children:i==null?void 0:i.data.map(a=>e.jsxs("button",{type:"button",onClick:()=>f(a),className:`\r
                          flex\r
                          w-full\r
                          items-center\r
                          justify-between\r
                          px-4\r
                          py-3\r
                          text-left\r
                          transition\r
                          hover:bg-slate-50\r
                        `,children:[e.jsxs("div",{className:"flex min-w-0 items-center gap-3",children:[e.jsx("div",{className:"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500",children:e.jsx(D,{size:15})}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"truncate text-sm font-medium text-slate-900",children:a.name}),e.jsxs("p",{className:"mt-0.5 truncate text-xs text-slate-400",children:[a.phone||"No phone",a.email?` · ${a.email}`:""]})]})]}),a.id===d&&e.jsx(A,{size:17,className:"ml-3 shrink-0 text-blue-600"})]},a.id))})]})]})})}function ne(){const d=L(),[l,x]=c.useState(),[s,u]=c.useState({name:"",phone:"",email:""}),[o,h]=c.useState([]),{createInvoice:g,isPending:y}=Q(),[i,j]=c.useState(0),[p,b]=c.useState(0),[f,C]=c.useState(0),[a,S]=c.useState("cash"),k=c.useMemo(()=>o.reduce((t,r)=>t+r.selling_price_per_unit*r.quantity,0),[o]),_=c.useMemo(()=>o.reduce((t,r)=>t+r.discount,0),[o]),P=c.useMemo(()=>k-_-i+p+f,[k,_,i,p,f]);function T(t){h(r=>r.find(n=>n.id===t.id)?r.map(n=>n.id===t.id?{...n,quantity:n.quantity+1}:n):[...r,{...t,quantity:1,discount:0}])}function I(t,r){r<0||h(m=>m.map(n=>n.id===t?{...n,quantity:r}:n))}function q(t,r){r<0||h(m=>m.map(n=>n.id===t?{...n,discount:r}:n))}function M(t){h(r=>r.filter(m=>m.id!==t))}function R(){if(o.length===0){Y("Please add at least one product",{type:"error"});return}const t=n=>(n??"").trim().toLowerCase(),m={customer_id:l!=null&&l.id&&t(l==null?void 0:l.name)===t(s.name)?l.id:null,customer_name:s.name||null,customer_phone:s.phone||null,customer_email:s.email||null,order_discount:i,shipping_fee:p,service_fee:f,tax_amount:0,payment_method:a,items:o.map(n=>({product_id:n.id,quantity:n.quantity,unit_price:n.selling_price_per_unit,discount_amount:n.discount}))};g(m)}return e.jsxs("div",{className:"space-y-5 pb-6",children:[e.jsx("div",{className:"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{type:"button",onClick:()=>d("/sales"),className:"group shrink-0","aria-label":"Go back",children:e.jsx(U,{size:29,className:`\r
                text-slate-300\r
                transition\r
                group-hover:text-blue-600\r
              `})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-slate-900",children:"Create Invoice"}),e.jsx("span",{className:`\r
                rounded-full\r
                bg-blue-50\r
                px-2.5 py-1\r
                text-[11px] font-semibold\r
                text-blue-700\r
              `,children:"New Sale"})]}),e.jsx("p",{className:"mt-1 text-sm text-slate-500",children:"Create a new sales invoice and record payment."})]})]})}),e.jsxs("div",{className:"grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]",children:[e.jsxs("div",{className:"space-y-5",children:[e.jsxs("section",{className:"rounded-xl border border-slate-200 bg-white",children:[e.jsx(w,{icon:e.jsx(D,{size:18}),title:"Customer",description:"Customer information snapshot",iconClass:"bg-blue-50 text-blue-600",action:e.jsx(J,{value:"",onChange:t=>{x(t),u({...s,name:t.name,phone:t.phone??"",email:t.email??""})}})}),e.jsxs("div",{className:"grid grid-cols-1 gap-4 p-5 md:grid-cols-3",children:[e.jsx(F,{label:"Customer Name",value:s.name,placeholder:"Walk-in Customer",onChange:t=>u({...s,name:t})}),e.jsx(F,{label:"Phone",value:s.phone,placeholder:"08xxxxxxxxxx",onChange:t=>u({...s,phone:t})}),e.jsx(F,{label:"Email",value:s.email,placeholder:"customer@email.com",onChange:t=>u({...s,email:t})})]})]}),e.jsxs("section",{className:"rounded-xl border border-slate-200 bg-white",children:[e.jsxs("div",{className:"border-b border-slate-100 bg-slate-50/40 px-5 py-4",children:[e.jsxs("div",{className:"mb-3 flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-slate-900",children:"Products"}),e.jsx("p",{className:"mt-0.5 text-xs text-slate-400",children:"Search and add products to this invoice."})]}),o.length>0&&e.jsxs("span",{className:"rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500",children:[o.length," ",o.length===1?"item":"items"]})]}),e.jsx(Z,{value:"",onChange:T})]}),o.length===0?e.jsxs("div",{className:"flex flex-col items-center justify-center px-5 py-14 text-center",children:[e.jsx("div",{className:`\r
                  flex h-12 w-12\r
                  items-center justify-center\r
                  rounded-xl\r
                  bg-slate-100\r
                  text-slate-400\r
                `,children:e.jsx(G,{size:21})}),e.jsx("p",{className:"mt-3 text-sm font-semibold text-slate-600",children:"No products added"}),e.jsx("p",{className:"mt-1 max-w-xs text-xs leading-5 text-slate-400",children:"Add a product to start creating the invoice."})]}):e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full min-w-[760px]",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-y border-slate-100 bg-slate-50/70",children:[e.jsx("th",{className:"px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500",children:"Product"}),e.jsx("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500",children:"Price"}),e.jsx("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500",children:"Qty"}),e.jsx("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500",children:"Discount"}),e.jsx("th",{className:"px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500",children:"Total"}),e.jsx("th",{className:"w-10 px-4 py-3"})]})}),e.jsx("tbody",{className:"divide-y divide-slate-100",children:o.map(t=>{const m=t.selling_price_per_unit*t.quantity-t.discount;return e.jsxs("tr",{className:"transition hover:bg-slate-50/60",children:[e.jsxs("td",{className:"px-5 py-4",children:[e.jsx("p",{className:"text-sm font-semibold text-slate-800",children:t.name}),e.jsx("p",{className:"mt-0.5 text-xs text-slate-400",children:t.sku})]}),e.jsx("td",{className:"px-4 py-4 text-sm text-slate-600",children:v(t.selling_price_per_unit)}),e.jsxs("td",{className:"px-4 py-4",children:[e.jsx("input",{type:"number",min:1,step:1,value:t.quantity===0?"":t.quantity,onChange:n=>I(t.id,Number(n.target.value)),className:`\r
                                h-9 w-16\r
                                rounded-lg\r
                                border border-slate-200\r
                                bg-white\r
                                px-2\r
                                text-center\r
                                text-sm\r
                                outline-none\r
                                transition\r
                                focus:border-blue-500\r
                                focus:ring-2\r
                                focus:ring-blue-50\r
                              `}),t.unit]}),e.jsx("td",{className:"px-4 py-4",children:e.jsxs("div",{className:"relative w-28",children:[e.jsx("span",{className:`\r
                                pointer-events-none\r
                                absolute left-2.5 top-1/2\r
                                -translate-y-1/2\r
                                text-[11px]\r
                                font-medium\r
                                text-slate-400\r
                              `,children:"Rp"}),e.jsx("input",{type:"number",min:0,value:t.discount===0?"":t.discount,onChange:n=>q(t.id,Number(n.target.value)),className:`\r
                                  h-9 w-full\r
                                  rounded-lg\r
                                  border border-slate-200\r
                                  bg-white\r
                                  pl-8 pr-2\r
                                  text-sm\r
                                  outline-none\r
                                  transition\r
                                  focus:border-blue-500\r
                                  focus:ring-2\r
                                  focus:ring-blue-50\r
                                `})]})}),e.jsx("td",{className:"px-4 py-4 text-right",children:e.jsx("span",{className:"text-sm font-bold text-slate-800",children:v(m)})}),e.jsx("td",{className:"px-4 py-4",children:e.jsx("button",{type:"button",onClick:()=>M(t.id),className:`\r
                                rounded-lg\r
                                p-2\r
                                text-slate-300\r
                                transition\r
                                hover:bg-red-50\r
                                hover:text-red-500\r
                              `,"aria-label":`Remove ${t.name}`,children:e.jsx(H,{size:15})})})]},t.id)})})]})})]})]}),e.jsxs("div",{className:"space-y-5",children:[e.jsxs("section",{className:"rounded-xl border border-slate-200 bg-white",children:[e.jsx(w,{icon:e.jsx(K,{size:18}),title:"Invoice Details",description:"Sale information",iconClass:"bg-slate-100 text-slate-600"}),e.jsx("div",{className:"space-y-4 p-5",children:e.jsxs("div",{children:[e.jsx("label",{htmlFor:"invoice-date",className:"text-xs font-semibold text-slate-600",children:"Date"}),e.jsx("input",{id:"invoice-date",type:"date",defaultValue:"2026-08-18",className:`\r
                    mt-1.5\r
                    h-10 w-full\r
                    rounded-lg\r
                    border border-slate-200\r
                    bg-white\r
                    px-3.5\r
                    text-sm text-slate-700\r
                    outline-none\r
                    transition\r
                    focus:border-blue-500\r
                    focus:ring-4\r
                    focus:ring-blue-50\r
                  `})]})})]}),e.jsxs("section",{className:"rounded-xl border border-slate-200 bg-white",children:[e.jsx(w,{icon:e.jsx(V,{size:18}),title:"Discounts & Fees",description:"Adjust the final amount",iconClass:"bg-amber-50 text-amber-600"}),e.jsxs("div",{className:"space-y-4 p-5",children:[e.jsx(z,{label:"Order Discount",value:i,onChange:j}),e.jsx(z,{label:"Shipping Fee",value:p,onChange:b}),e.jsx(z,{label:"Service Fee",value:f,onChange:C})]})]}),e.jsxs("section",{className:"rounded-xl border border-slate-200 bg-white",children:[e.jsx(w,{icon:e.jsx(W,{size:18}),title:"Payment",description:"Select payment method",iconClass:"bg-blue-50 text-blue-600"}),e.jsx("div",{className:"p-5",children:e.jsx("div",{className:"grid grid-cols-2 gap-2",children:[["cash","Cash"],["transfer","Transfer"],["qris","QRIS"],["card","Card"]].map(([t,r])=>{const m=a===t;return e.jsx("button",{type:"button",onClick:()=>S(t),className:`
                        rounded-lg
                        border
                        px-3 py-2.5
                        text-sm font-semibold
                        transition
                        ${m?"border-blue-500 bg-blue-50 text-blue-700":"border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"}
                      `,children:r},t)})})})]}),e.jsxs("section",{className:`\r
            overflow-hidden\r
            rounded-xl\r
            border border-blue-200\r
            bg-white\r
          `,children:[e.jsxs("div",{className:"bg-blue-600 px-5 py-4",children:[e.jsx("p",{className:`\r
                text-[11px]\r
                font-semibold\r
                uppercase\r
                tracking-wider\r
                text-blue-100\r
              `,children:"Total Amount"}),e.jsx("p",{className:"mt-1 text-2xl font-bold text-white",children:v(P)})]}),e.jsxs("div",{className:"space-y-3 p-5",children:[e.jsx(N,{label:"Subtotal",value:k}),e.jsx(N,{label:"Item Discount",value:-_,negative:!0}),e.jsx(N,{label:"Order Discount",value:-i,negative:!0}),e.jsx(N,{label:"Shipping",value:p}),e.jsx(N,{label:"Service Fee",value:f}),e.jsx("div",{className:"border-t border-dashed border-slate-200 pt-3",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm font-semibold text-slate-700",children:"Total"}),e.jsx("span",{className:"text-lg font-bold text-blue-600",children:v(P)})]})}),e.jsx("button",{type:"button",disabled:y,className:`\r
    mt-2\r
    flex w-full\r
    items-center\r
    justify-center\r
    rounded-lg\r
    bg-blue-600\r
    px-4 py-2.5\r
    text-sm font-bold\r
    text-white\r
    transition\r
    hover:bg-blue-700\r
    focus:outline-none\r
    focus:ring-4\r
    focus:ring-blue-100\r
    disabled:cursor-not-allowed\r
    disabled:opacity-50\r
  `,onClick:R,children:y?"Completing Sale...":"Complete Sale"})]})]})]})]})]})}function w({icon:d,title:l,description:x,iconClass:s,action:u}){return e.jsxs("div",{className:`\r
      flex flex-col gap-3\r
      border-b border-slate-100\r
      px-5 py-4\r
      sm:flex-row sm:items-center sm:justify-between\r
    `,children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`
          flex h-9 w-9
          shrink-0
          items-center justify-center
          rounded-lg
          ${s}
        `,children:d}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-slate-900",children:l}),e.jsx("p",{className:"mt-0.5 text-xs text-slate-400",children:x})]})]}),u]})}function F({label:d,value:l,placeholder:x,onChange:s}){return e.jsxs("div",{children:[e.jsx("label",{className:"mb-1.5 block text-xs font-semibold text-slate-600",children:d}),e.jsx("input",{value:l,onChange:u=>s(u.target.value),placeholder:x,className:`\r
          h-10 w-full\r
          rounded-lg\r
          border border-slate-200\r
          bg-white\r
          px-3.5\r
          text-sm text-slate-800\r
          outline-none\r
          placeholder:text-slate-400\r
          transition\r
          hover:border-slate-300\r
          focus:border-blue-500\r
          focus:ring-4\r
          focus:ring-blue-50\r
        `})]})}function z({label:d,value:l,onChange:x}){return e.jsxs("div",{children:[e.jsx("label",{className:"mb-1.5 block text-xs font-semibold text-slate-600",children:d}),e.jsxs("div",{className:"relative",children:[e.jsx("span",{className:`\r
          pointer-events-none\r
          absolute left-3.5 top-1/2\r
          -translate-y-1/2\r
          text-xs font-medium\r
          text-slate-400\r
        `,children:"Rp"}),e.jsx("input",{type:"number",min:0,value:l||"",onChange:s=>x(Number(s.target.value)),className:`\r
            h-10 w-full\r
            rounded-lg\r
            border border-slate-200\r
            bg-white\r
            py-2.5 pl-10 pr-3\r
            text-sm text-slate-800\r
            outline-none\r
            transition\r
            hover:border-slate-300\r
            focus:border-blue-500\r
            focus:ring-4\r
            focus:ring-blue-50\r
          `})]})]})}function N({label:d,value:l,negative:x=!1}){return e.jsxs("div",{className:"flex items-center justify-between text-sm",children:[e.jsx("span",{className:"text-slate-500",children:d}),e.jsx("span",{className:x?"font-medium text-amber-600":"font-medium text-slate-700",children:v(l)})]})}export{ne as default};
