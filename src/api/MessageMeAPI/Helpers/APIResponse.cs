using MessageMeAPI.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageMeAPI.Helpers
{
    public class APIResponse
    {
        public APIResponse()
        {
            this.error = null;
            this.data = Utils.emptyBody();
        }
        public string error { get; set; }
        public bool success { get; set; }
        public Object data { get; set; }
    }
}
