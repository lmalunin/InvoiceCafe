using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;

namespace InvoiceCafe.Services
{
    public static class LogMessage
    {
        public static string LogFormat(this string str, out string output, ControllerContext context = null, object obj = null)
        {
            var eventId = Guid.NewGuid();
            var date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            output = (new { dateTime = date, eventId = eventId }).ToString();

            string baseString = string.Format("{0},{1}", date, eventId);

            if (!string.IsNullOrEmpty(str))
            {
                baseString += string.Format("{0},", str);
            }

            if (context != null)
            {
                baseString += string.Format("Controller:{0}, Action:{1}, ", context.ActionDescriptor.ControllerName, context.ActionDescriptor.ActionName);
            }

            if (obj != null)
            {
                var strObj = "{\"" + obj.GetType().ToString() + "\":" + JsonConvert.SerializeObject(obj) + "}}";
                baseString += string.Format("{0}", strObj);
            }

            return baseString;
        }
    }
}