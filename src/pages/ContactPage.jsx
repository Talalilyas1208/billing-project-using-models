import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Button from '../components/common/Button';

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Phone className="w-6 h-6 text-blue-600" />
          Support & Accounting Contact
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Get in touch with Billy.dk accounting advisors and technical support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Direct Advisor Desk</h2>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">+45 60 24 60 24</p>
                <p className="text-[10px] text-slate-400">Mon - Fri: 08:30 - 17:00 CET</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">support@billy.dk</p>
                <p className="text-[10px] text-slate-400">Avg. response time: 15 mins</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Billy.dk Headquarters</p>
                <p className="text-[10px] text-slate-400">Østergade 12, 1100 København K, Denmark</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Send Quick Message</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Message sent to Billy.dk support!'); }} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Tax or VAT question..."
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Message</label>
              <textarea
                rows="3"
                placeholder="Describe your inquiry..."
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <Button type="submit" variant="primary" icon={Send} className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
