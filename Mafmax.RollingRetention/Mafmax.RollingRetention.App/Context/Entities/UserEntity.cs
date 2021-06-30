using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Mafmax.RollingRetention.App.Context.Entities
{
    [Table("Users")]
    public class UserEntity
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        public DateTime RegistrationDate { get; set; }
        public DateTime LastActivityDate { get; set; }
    }
}
