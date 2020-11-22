using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageMeAPI.Models
{
    [Table("users")]
    public class Users
    {
        [ExplicitKey]
        public long id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string avatar { get; set; }
    }
}
