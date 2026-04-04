# Same-Channel Full-Duplex Radios

"Duplexing" refers to the establishment of a two-way communcation between two nodes. Conventionally, digital communication protocols were classified as "full-duplex" and "half-duplex" based on whether they have two wires for sending and receiving or if they had to take turns on the same wire. Good examples of these are SPI3 and SPI4 respectively. 


Radios in modern communication systems are classified into time-division duplex (TDD), frequency-division duplex (FDD) and full-duplex (FD). TDD uses the same frequency band but assigns time-slots between which sending and receiving are done alternatingly. FDD is when two different bands are used for simulateous communication. FD is when the same band is used at the same time.

<figure class="figure">
  <img src="/blogs/images/TDD_FDD_FD.png" alt="Diagram" />
  <figcaption>
    <b>Figure 1:</b> FDD vs TDD vs FD. Partially Adapted from [1] and [2]
  </figcaption>
</figure>



# References

[1] Dahlman et al., IEEE Comm Mag, Apr 2009

[2] Prof. David Koilpillai, EE6143: Advanced Topics in 5G Communications, IIT Madras, Aug 2024
