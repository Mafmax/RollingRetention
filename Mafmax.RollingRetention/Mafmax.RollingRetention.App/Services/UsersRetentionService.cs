using Mafmax.RollingRetention.App.Context.DTOs;
using Mafmax.RollingRetention.App.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mafmax.RollingRetention.App.Services
{
    public class UsersRetentionService : IRetentionsService
    {
        private readonly IUsersRetentionRepository repository;

        public UsersRetentionService(IUsersRetentionRepository repository)
        {
            this.repository = repository;
        }
        public IEnumerable<UserRetentionDto> GetUsersRetention()
        {
            return repository.GetUsersRetention();
            
        }

        public void SaveUserRetention(IEnumerable<UserRetentionDto> users)
        {
            repository.SaveUserRetention(users);
        }
    }
}
