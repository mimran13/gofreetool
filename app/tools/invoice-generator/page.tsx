'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function InvoiceGenerator() {
  const tool = getToolBySlug('invoice-generator');
  const printRef = useRef<HTMLDivElement>(null);

  const [businessName, setBusinessName] = useState('Your Business Name');
  const [businessEmail, setBusinessEmail] = useState('email@business.com');
  const [clientName, setClientName] = useState('Client Name');
  const [clientEmail, setClientEmail] = useState('client@email.com');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Service or Product', quantity: 1, price: 100 },
  ]);
  const [notes, setNotes] = useState('Thank you for your business!');
  const [taxRate, setTaxRate] = useState(0);

  const addItem = useCallback(() => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  }, [items]);

  const removeItem = useCallback((id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  }, [items]);

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  }, [items]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items, taxRate]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const printInvoice = useCallback(() => {
    window.print();
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8 print:hidden">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create <strong>professional invoices</strong> for your business. Add your details,
          line items, and print or save as PDF. Perfect for freelancers and small businesses.
          <strong> All data stays in your browser</strong> — nothing is uploaded.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1">
        {/* Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 print:hidden">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Invoice Details</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Business</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Line Items</label>
                <button onClick={addItem} className="text-sm text-teal-600 hover:text-teal-700">+ Add Item</button>
              </div>
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Description"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-center"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="text-red-500 px-2">×</button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={printInvoice}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Preview */}
        <div ref={printRef} className="bg-white rounded-xl border border-gray-200 p-8 print:border-none print:p-0">
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{businessName}</h2>
              <p className="text-gray-600">{businessEmail}</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-600">{invoiceNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Bill To</h3>
              <p className="font-medium text-gray-900">{clientName}</p>
              <p className="text-gray-600">{clientEmail}</p>
            </div>
            <div className="text-right">
              <p><span className="text-gray-500">Date:</span> {invoiceDate}</p>
              <p><span className="text-gray-500">Due:</span> {dueDate}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-500 font-medium">Description</th>
                <th className="text-right py-2 text-gray-500 font-medium">Qty</th>
                <th className="text-right py-2 text-gray-500 font-medium">Price</th>
                <th className="text-right py-2 text-gray-500 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">{item.description || 'Item'}</td>
                  <td className="py-3 text-right text-gray-900">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-900">{formatCurrency(item.price)}</td>
                  <td className="py-3 text-right text-gray-900">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(totals.subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Tax ({taxRate}%)</span>
                  <span className="text-gray-900">{formatCurrency(totals.tax)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>

          {notes && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">{notes}</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
