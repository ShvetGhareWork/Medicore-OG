package com.example.identity.repository;

import com.example.identity.entity.Staff;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long>, JpaSpecificationExecutor<Staff> {
    Optional<Staff> findByEmail(String email);
    Optional<Staff> findByStaffId(String staffId);
    boolean existsByEmail(String email);
    boolean existsByStaffId(String staffId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s.staffId FROM Staff s WHERE s.staffId LIKE :pattern")
    List<String> findStaffIdsForPrefixWithLock(@Param("pattern") String pattern);
}
