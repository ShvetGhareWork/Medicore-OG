package com.example.heal.entity;

import com.example.heal.entity.type.BloodGroupType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false, unique = true)
    private String firstName;
    private String lastName;

    @Column(unique = true,  nullable = false)
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    private String gender;

    private LocalDate birthDate;

    @OneToOne(cascade = CascadeType.ALL)
    @MapsId
    private User user;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDate createdAt;

    @Enumerated(EnumType.STRING)
    private BloodGroupType bloodGroupType;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "insurance_id", referencedColumnName = "id")
    private Insurance insurance;

    // ✅ Add this mapping block so Hibernate knows what 'p.appointments' means
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;

}
