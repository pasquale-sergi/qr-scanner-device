package com.pasquale.qr_scanner_device.Service;

import com.pasquale.qr_scanner_device.Entity.ApplicationUser;
import com.pasquale.qr_scanner_device.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username){
        ApplicationUser user = userRepository.findByUsername(username).orElseThrow(()->new UsernameNotFoundException("User not found"));

        return UserDetailsImpl.build(user);
    }
}
