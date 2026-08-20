import{a as W,r as s,a4 as B,a5 as G,j as e,a6 as K,a7 as O,G as X,T as Z,a8 as q,Z as F,a2 as J,a9 as z,aa as Q,O as Y,ab as D,U as _,ac as P,K as T,E as ee,ad as te}from"./index-DWYr6O-K.js";import{u as se}from"./utilsHook-ByR4y5Ol.js";import{D as ne}from"./DeleteConfirmModal-D-REwW8t.js";function ie(){const r=W(),[i,n]=s.useState(1),[o,j]=s.useState(""),[h,f]=s.useState(""),[x,v]=s.useState(""),[u,N]=s.useState(""),[p,y]=s.useState(""),I=se(o,300),[a,m]=s.useState(null),{cancelSale:M,isCancelling:w}=B(),[C,S]=s.useState(!1),{sales:d,pagination:b,isPending:l,isError:c,error:k}=G({page:i,per_page:20,search:I,status:h,payment_method:p,date_from:x,date_to:u}),g=b.pages??0,A=t=>{j(t.target.value),n(1)},L=t=>{f(t.target.value),n(1)},R=t=>{y(t.target.value),n(1)},V=()=>{j(""),f(""),y(""),v(""),N("")},$=t=>{v(t.target.value)},H=t=>{N(t.target.value)};async function U(){S(!0),await te("/api/sales/export","sales"),S(!1)}return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-slate-900",children:"Sales History"}),e.jsx("p",{className:"mt-1 text-sm text-slate-500",children:"View and manage your completed and pending sales."})]}),e.jsxs("div",{className:"flex flex-col gap-2 sm:flex-row",children:[e.jsx("button",{type:"button",onClick:U,disabled:C,className:`\r
    inline-flex items-center justify-center gap-2\r
    rounded-lg\r
    border border-slate-200\r
    bg-white\r
    px-4 py-2.5\r
    text-sm font-semibold text-slate-700\r
    transition\r
    hover:bg-slate-50\r
    focus:outline-none\r
    focus:ring-4\r
    focus:ring-slate-100\r
    disabled:cursor-not-allowed\r
    disabled:opacity-60\r
  `,children:C?e.jsxs(e.Fragment,{children:[e.jsx(K,{size:17,className:"animate-spin"}),"Exporting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(O,{size:17}),"Export Excel"]})}),e.jsxs("button",{type:"button",onClick:()=>r("/sales/create-invoice"),className:`\r
        inline-flex items-center justify-center gap-2\r
        rounded-lg\r
        bg-blue-600\r
        px-4 py-2.5\r
        text-sm font-semibold text-white\r
        transition\r
        hover:bg-blue-700\r
        focus:outline-none\r
        focus:ring-4\r
        focus:ring-blue-100\r
      `,children:[e.jsx(X,{size:17}),"Create Invoice"]})]})]}),e.jsx("div",{className:"rounded-xl border border-slate-200 bg-white",children:e.jsxs("div",{className:"flex flex-col gap-3 p-4 lg:flex-row lg:items-center",children:[e.jsxs("div",{className:"relative flex-1",children:[e.jsx(Z,{size:17,className:`\r
                pointer-events-none\r
                absolute left-3.5 top-1/2\r
                -translate-y-1/2\r
                text-slate-400\r
              `}),e.jsx("input",{type:"text",value:o,onChange:A,placeholder:"Search invoice or customer...",className:`\r
                h-10 w-full rounded-lg\r
                border border-slate-200\r
                bg-white\r
                pl-10 pr-4\r
                text-sm text-slate-800\r
                outline-none\r
                placeholder:text-slate-400\r
                transition\r
                hover:border-slate-300\r
                focus:border-blue-500\r
                focus:ring-4\r
                focus:ring-blue-50\r
              `})]}),e.jsxs("div",{className:"relative",children:[e.jsx(q,{size:15,className:`\r
                pointer-events-none\r
                absolute left-3 top-1/2\r
                -translate-y-1/2\r
                text-slate-500\r
              `}),e.jsxs("select",{value:h,onChange:L,className:`\r
                h-10 min-w-[140px]\r
                appearance-none\r
                rounded-lg\r
                border border-slate-200\r
                bg-white\r
                pl-9 pr-8\r
                text-sm font-medium\r
                text-slate-600\r
                outline-none\r
                hover:border-slate-300\r
                focus:border-blue-500\r
                focus:ring-4\r
                focus:ring-blue-50\r
              `,children:[e.jsx("option",{value:"",children:"All Status"}),e.jsx("option",{value:"Completed",children:"Completed"}),e.jsx("option",{value:"Pending",children:"Pending"}),e.jsx("option",{value:"Cancelled",children:"Cancelled"})]}),e.jsx(F,{size:14,className:`\r
                pointer-events-none\r
                absolute right-3 top-1/2\r
                -translate-y-1/2\r
                text-slate-400\r
              `})]}),e.jsxs("div",{className:"relative",children:[e.jsx(J,{size:15,className:`\r
                pointer-events-none\r
                absolute left-3 top-1/2\r
                -translate-y-1/2\r
                text-slate-500\r
              `}),e.jsxs("select",{value:p,onChange:R,className:`\r
                h-10 min-w-[140px]\r
                appearance-none\r
                rounded-lg\r
                border border-slate-200\r
                bg-white\r
                pl-9 pr-8\r
                text-sm font-medium\r
                text-slate-600\r
                outline-none\r
                hover:border-slate-300\r
                focus:border-blue-500\r
                focus:ring-4\r
                focus:ring-blue-50\r
              `,children:[e.jsx("option",{value:"",children:"All Payment"}),e.jsx("option",{value:"Cash",children:"Cash"}),e.jsx("option",{value:"Transfer",children:"Transfer"}),e.jsx("option",{value:"Credit Card",children:"Credit Card"}),e.jsx("option",{value:"Debit Card",children:"Debit Card"})]}),e.jsx(F,{size:14,className:`\r
                pointer-events-none\r
                absolute right-3 top-1/2\r
                -translate-y-1/2\r
                text-slate-400\r
              `})]}),e.jsxs("div",{className:"relative",children:[e.jsx(z,{size:15,className:`\r
      pointer-events-none\r
      absolute left-3 top-1/2\r
      -translate-y-1/2\r
      text-slate-500\r
    `}),e.jsx("input",{type:"date",value:x,onChange:$,className:`\r
      h-10\r
      min-w-[155px]\r
      rounded-lg\r
      border border-slate-200\r
      bg-white\r
      pl-9 pr-3\r
      text-sm font-medium\r
      text-slate-600\r
      outline-none\r
      hover:border-slate-300\r
      focus:border-blue-500\r
      focus:ring-4\r
      focus:ring-blue-50\r
    `,title:"From date"})]}),e.jsxs("div",{className:"relative",children:[e.jsx(z,{size:15,className:`\r
      pointer-events-none\r
      absolute left-3 top-1/2\r
      -translate-y-1/2\r
      text-slate-500\r
    `}),e.jsx("input",{type:"date",value:u,min:x||void 0,onChange:H,className:`\r
      h-10\r
      min-w-[155px]\r
      rounded-lg\r
      border border-slate-200\r
      bg-white\r
      pl-9 pr-3\r
      text-sm font-medium\r
      text-slate-600\r
      outline-none\r
      hover:border-slate-300\r
      focus:border-blue-500\r
      focus:ring-4\r
      focus:ring-blue-50\r
    `,title:"To date"})]}),e.jsxs("button",{type:"button",onClick:V,disabled:!o&&!h&&!p&&!x&&!u,className:`\r
    inline-flex h-10\r
    items-center justify-center gap-2\r
    rounded-lg\r
    border border-slate-200\r
    bg-white\r
    px-4\r
    text-sm font-medium\r
    text-slate-600\r
    transition\r
    hover:border-slate-300\r
    hover:bg-slate-50\r
    hover:text-slate-900\r
    focus:outline-none\r
    focus:ring-4\r
    focus:ring-slate-100\r
    disabled:cursor-not-allowed\r
    disabled:opacity-40\r
    disabled:hover:border-slate-200\r
    disabled:hover:bg-white\r
    disabled:hover:text-slate-600\r
  `,children:[e.jsx(Q,{size:15}),"Clear filters"]})]})}),e.jsxs("div",{className:"overflow-hidden rounded-xl border border-slate-200 bg-white",children:[e.jsx("div",{className:"flex items-center justify-between border-b border-slate-200 px-5 py-4",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-slate-900",children:"Recent Sales"}),e.jsxs("p",{className:"mt-0.5 text-xs text-slate-500",children:[b.total," invoices found"]})]})}),l&&e.jsx("div",{className:"px-5 py-12 text-center",children:e.jsx("p",{className:"text-sm text-slate-500",children:"Loading sales..."})}),c&&!l&&e.jsxs("div",{className:"px-5 py-12 text-center",children:[e.jsx("p",{className:"text-sm font-medium text-red-600",children:"Failed to load sales."}),e.jsx("p",{className:"mt-1 text-xs text-slate-500",children:k instanceof Error?k.message:"Something went wrong."})]}),!l&&!c&&d.length===0&&e.jsxs("div",{className:"px-5 py-12 text-center",children:[e.jsx("p",{className:"text-sm font-medium text-slate-700",children:"No sales found"}),e.jsx("p",{className:"mt-1 text-xs text-slate-400",children:"Try changing your search or filters."})]}),!l&&!c&&d.length>0&&e.jsx("div",{className:"hidden overflow-x-auto md:block",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-slate-100 bg-slate-50/70",children:[e.jsx("th",{className:"px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",children:"Invoice"}),e.jsx("th",{className:"px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",children:"Customer"}),e.jsx("th",{className:"px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",children:"Date"}),e.jsx("th",{className:"px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",children:"Payment"}),e.jsx("th",{className:"px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500",children:"Total"}),e.jsx("th",{className:"px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500",children:"Status"}),e.jsx("th",{className:"px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500",children:"Action"})]})}),e.jsx("tbody",{className:"divide-y divide-slate-100",children:d.map(t=>e.jsxs("tr",{className:"transition hover:bg-slate-50/70",children:[e.jsxs("td",{className:"px-5 py-4",children:[e.jsx("p",{className:"text-sm font-semibold text-blue-600",children:t.invoice_number}),e.jsxs("p",{className:"mt-0.5 text-xs text-slate-400",children:[t.items.length," ",t.items.length===1?"item":"items"]})]}),e.jsx("td",{className:"px-5 py-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500",children:e.jsx(Y,{size:15})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium text-slate-800",children:t.customer_name||"Walk-in Customer"}),t.customer_phone&&e.jsx("p",{className:"mt-0.5 text-xs text-slate-400",children:t.customer_phone})]})]})}),e.jsx("td",{className:"px-5 py-4 text-sm text-slate-600",children:D(t.created_at)}),e.jsx("td",{className:"px-5 py-4",children:e.jsx("span",{className:"text-sm capitalize text-slate-600",children:t.payment_method||"-"})}),e.jsx("td",{className:"px-5 py-4 text-right",children:e.jsx("p",{className:"text-sm font-semibold text-slate-900",children:_(t.total)})}),e.jsx("td",{className:"px-5 py-4 text-center",children:e.jsx(E,{status:t.status})}),e.jsx("td",{className:"px-5 py-4 text-right",children:e.jsxs("div",{className:"inline-flex items-center gap-1",children:[e.jsx("button",{type:"button",onClick:()=>r(`/sales/${t.id}/invoice`),className:`\r
        inline-flex h-8 w-8\r
        items-center justify-center\r
        rounded-lg\r
        text-slate-400\r
        transition\r
        hover:bg-blue-50\r
        hover:text-blue-600\r
      `,title:"View invoice",children:e.jsx(P,{size:16})}),e.jsx("button",{type:"button",onClick:()=>m(t),disabled:t.status==="cancelled",className:`\r
        inline-flex h-8 w-8\r
        items-center justify-center\r
        rounded-lg\r
        text-slate-400\r
        transition\r
        hover:bg-red-50\r
        hover:text-red-600\r
        disabled:cursor-not-allowed\r
        disabled:opacity-30\r
      `,title:t.status==="cancelled"?"Invoice cancelled":"Cancel invoice",children:e.jsx(T,{size:16})})]})})]},t.id))})]})}),!l&&!c&&d.length>0&&e.jsx("div",{className:"divide-y divide-slate-100 md:hidden",children:d.map(t=>e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex items-start justify-between gap-3",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-sm font-semibold text-blue-600",children:t.invoice_number}),e.jsx("p",{className:"mt-1 truncate text-sm font-medium text-slate-800",children:t.customer_name||"Walk-in Customer"}),t.customer_phone&&e.jsx("p",{className:"mt-0.5 text-xs text-slate-400",children:t.customer_phone})]}),e.jsx(E,{status:t.status})]}),e.jsxs("div",{className:"mt-4 grid grid-cols-2 gap-x-4 gap-y-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-medium uppercase tracking-wide text-slate-400",children:"Date"}),e.jsx("p",{className:"mt-0.5 text-xs text-slate-600",children:D(t.created_at)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-medium uppercase tracking-wide text-slate-400",children:"Payment"}),e.jsx("p",{className:"mt-0.5 text-xs capitalize text-slate-600",children:t.payment_method||"-"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-medium uppercase tracking-wide text-slate-400",children:"Items"}),e.jsxs("p",{className:"mt-0.5 text-xs text-slate-600",children:[t.items.length," ",t.items.length===1?"item":"items"]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-[11px] font-medium uppercase tracking-wide text-slate-400",children:"Total"}),e.jsx("p",{className:"mt-0.5 text-sm font-bold text-slate-900",children:_(t.total)})]})]}),e.jsxs("div",{className:"mt-4 flex gap-2 border-t border-slate-100 pt-3",children:[e.jsxs("button",{type:"button",onClick:()=>r(`/sales/${t.id}/invoice`),className:`\r
              inline-flex\r
              h-9\r
              flex-1\r
              items-center\r
              justify-center\r
              gap-2\r
              rounded-lg\r
              border\r
              border-slate-200\r
              bg-white\r
              px-3\r
              text-xs\r
              font-medium\r
              text-slate-600\r
              transition\r
              hover:border-blue-200\r
              hover:bg-blue-50\r
              hover:text-blue-600\r
            `,children:[e.jsx(P,{size:14}),"View Invoice"]}),e.jsxs("button",{type:"button",onClick:()=>m(t),disabled:t.status.toLowerCase()==="cancelled",className:`\r
              inline-flex\r
              h-9\r
              flex-1\r
              items-center\r
              justify-center\r
              gap-2\r
              rounded-lg\r
              border\r
              border-slate-200\r
              bg-white\r
              px-3\r
              text-xs\r
              font-medium\r
              text-slate-600\r
              transition\r
              hover:border-red-200\r
              hover:bg-red-50\r
              hover:text-red-600\r
              disabled:cursor-not-allowed\r
              disabled:opacity-30\r
            `,children:[e.jsx(T,{size:14}),"Cancel Invoice"]})]})]},t.id))}),!l&&!c&&g>0&&e.jsx(ee,{page:b.page,total_page:g,onNext:()=>n(t=>Math.min(t+1,g)),onPrev:()=>n(t=>Math.max(t-1,1))})]}),e.jsx(ne,{open:a!==null,title:"Cancel Invoice",message:"Are you sure you want to cancel this invoice? The stock will be returned to inventory.",itemName:a==null?void 0:a.invoice_number,isDeleting:w,onClose:()=>{w||m(null)},onConfirm:()=>{a&&M(a.id,{onSuccess:()=>{m(null)}})}})]})}function E({status:r}){const i=r.toLowerCase(),n=i==="completed",o=i==="cancelled"||i==="canceled";return e.jsx("span",{className:`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${n?"bg-emerald-50 text-emerald-700":o?"bg-red-50 text-red-700":"bg-amber-50 text-amber-700"}`,children:r})}export{ie as default};
