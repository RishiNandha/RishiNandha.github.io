# 1. Same-Channel Full-Duplex Radios

"Duplexing" refers to the establishment of a two-way communcation between two nodes. Conventionally, digital copperline protocols were classified as "**half-duplex**" where the same wire is shared on basis of taking turns, and "**full-duplex**" where two dedicated wires are used.

<figure class="figure figure_scale_60">
  <img src="/blogs/images/HD_FD.png" alt="Diagram" />
  <figcaption>
    <b>Figure 1:</b> Half-Duplex vs Full-Duplex
  </figcaption>
</figure>

Radios in modern communication systems are classified into time-division duplex (TDD), frequency-division duplex (FDD) and full-duplex (FD). **TDD** uses the same frequency band but assigns different time-slots for sending and receiving. **FDD** uses two different bands for simultaneity. **FD** is when the same band is used at the same time.

<figure class="figure figure_scale_75">
  <img src="/blogs/images/TDD_FDD_FD.png" alt="Diagram" />
  <figcaption>
    <b>Figure 2:</b> FDD vs TDD vs FD. Partially Adapted from [1] and [2]
  </figcaption>
</figure>

By transmitting and receiving on different antennas, the self interference (SI) from the transmitter signal (TX) can be digitally cancelled digitally from the received signal (RX) with adaptive filters. This is doable because we know exactly what TX signal is being sent out. Now a slightly more interesting question is: **Can we somehow use the same antenna?**

<figure class="figure figure_scale_90">
  <img src="/blogs/images/SCFD.png" alt="Diagram" />
  <figcaption>
    <b>Figure 3:</b> Conventional Full-Duplex vs Same-Channel Full-Duplex 
  </figcaption>
</figure>

> **Same-Channel Full-Duplex (SCFD)** is when the same antenna is used to send and receive in the same frequency band at the same time

Full-Duplex is an active area of research among both antenna designers and RF IC designers, with atleast one article on IEEE transactions journals every year. While antenna designers focus on the conventional way by using techniques such phased antenna arrays, the RF IC folks (like myself) have taken more interest in SCFD (also known as IBFD). Below are 3 different ways to go about SCFD:  
1. **Circulators / Directional Couplers:** PCB-scale 3-port stuctures made either with ferrites or waveguides. These allow signal from port 'x' to go only into port 'x+1' (hence called "circulators")
2. **Phased-Shifted Addition:** A copy of the TX signal shifted by 180° in phase is added to the RX signal in the RF domain (on-chip), thereby cancelling the SI.
3. **Electrical Balance Duplexing (EBD):** A wheatstone-like bridge is made to manipulate the signals such that the TX-signal is seen as a common-mode signal across the RX and is rejected.

We will discuss the EBD in detail here, and briefly touch upon my research with the [ICS Group at IIT Madras](https://www.ee.iitm.ac.in/ics).

#### Disclaimer

This article will focus more on motivating this area of research intuitively more than rigorous analysis. For a more rigorous discussion, consider reading the following publications. [[3]](https://ieeexplore.ieee.org/document/8315501) is a publication by my master's thesis guide [Prof. Aniruddhan](https://www.ee.iitm.ac.in/ani/) and his former PhD student. [[5]](https://rfic.ucsd.edu/wp-content/uploads/2024/12/2014-Tunable_CMOS_Integrated_Duplexer_With_Antenna_Impedance_Tracking_and_High_Isolation_in_the_Transmit_and_Receive_Bands.pdf) is one of the earlier works in this direction. [[4]](https://ieeexplore.ieee.org/document/6942122) is another related work by IMEC and KU Leuven.

This article also assumes some background in analog design, and uses terms such as "common-mode rejection ratio" without detailed explanations. The reader is encouraged to Google these terms if they are unfamiliar and follow along!

#### Correspondence

For any queries on this article, or for expressing interest in knowing more about this line of research, feel free to contact [me](/) or [Prof. Aniruddhan](https://www.ee.iitm.ac.in/ani/). I do have some roads I had to leave untravelled during my thesis in the interest of time, which you might find interest in continuing ;)

# 2. Capacitance Bridge Duplexer

## 2.1. Some History

The concept of using a transformer to cancel out common-mode signals dates all the way back to 1968 [7]. Well who would've thought that this would make a comeback in 2009! It did when Prof. Abidi (UCLA) and collaborators [8] showed that this concept can be used to make a fully integrated duplexer. After this, researchers at UCSD [5], IMEC and KU Leuven [4, 6] further developed tunable on-chip duplexers. Their **hybrid transformer** duplexers essentially looked like these:

<figure class="figure figure_scale_70">
  <img src="/blogs/images/HybridT.png" alt="Diagram" />
  <figcaption>
    <b>Figure 4:</b> (a) Duplexer in [8] (2009). (b) Duplexer in [5] (2014)
  </figcaption>
</figure>


In 2018, Abhishek Kumar (now a [Professor at IITH](https://iith.ac.in/ee/akumar/)) and Prof. Aniruddhan (IITM) proposed that instead of relying on tapping at different points to do the job, we use **lumped capacitors and a standard balun** [3]. They showed that this also greatly improves the performance of the duplexer as we will see soon. 

## 2.2. The Elephant in the Room

Let's address it rightaway: Figure 5 shows the duplexer used by Kumar et al. [3]. My design that is current under progress follows a very similar duplexer too. Why this works may not be trivial, so we'll consider one perspective at a time. 

<figure class="figure figure_scale_40">
  <img src="/blogs/images/Cbridge.png" alt="Diagram" />
  <figcaption>
    <b>Figure 5:</b> Capacitance Bridge Duplexer, Adapted from [3]
  </figcaption>
</figure>

## 2.3. Theory of Operation
 
Let's look at the bridge from the TX's perspective. Let's remove the balun for now. The signal developed between the C1 and Z_ANT will be equal to the signal at C2 and Z_BAL if **C1·Z_ANT = C2·Z_BAL**.

<figure class="figure figure_scale_40">
  <img src="/blogs/images/balance.png" alt="Diagram" />
  <figcaption>
    <b>Figure 6:</b> TX Perspective
  </figcaption>
</figure>

So if we read the RX signal differentially, the TX signal would become a common-mode, which can be cancelled if our RX chain has high CMRR. Hence, we add the balun as shown in figure 5 to cancel the high TX swing before it reaches the LNA in the RX chain. In summary: 

> 1. **TX Signal is seen as a common-mode across RX**
> 2. ANT Signal is seen in differential-mode across the RX after incurring a small loss, we'll call this **"NF_RX"**
> 3. TX Signal reaches the Antenna after incurring a small loss, we'll call this **"IL_TX"**.

## 2.4. Is This Actually Better? - Performance Metrics

Shannon limit dictates that the bitrate varies as the B·log(1 + SNR). So the reduction in bitrate for the TX and RX paths are approximately IL_TX and NF_RX respectively. Thus **IL_TX + NF_RX** is taken as the performance metric for duplexers. 

If we had two antennas, we would transmit and receive on both. So there is an additional factor of 2 on both RX and TX paths when we compare 2x SCFD antennas with 2x conventional FD antennas. So if we have **IL_TX + NF_RX < 12 dB**, then the design can be considered worthwhile. [3] showed that using a C-bridge achieves better IL_TX + NF_RX than the hybrid transformers. 

# 3. Why Should Z_BAL Be Tunable?

## 3.1. Smith Chart of a Real Antenna



# 4. What Currently Brewing in Research?

## 4.1. Wideband vs Narrowband

# References

<div class="references">
  <p>[1] <a href="https://ee.eng.usm.my/eeacad/nazriee/EEE440/GrpAssignmnt/LTEpaper.pdf">
    Dahlman et al., IEEE Comm Mag, Apr 2009
  </a></p>

  <p>[2] Prof. David Koilpillai, EE6143: Advanced Topics in 5G Communications, IIT Madras, Aug 2024</p>

  <p>[3] A. Kumar and S. Aniruddhan, "A 2.5-GHz CMOS Full-Duplex Front-End for Asymmetric Data Networks," in 
    <a href="https://ieeexplore.ieee.org/document/8315501">
      IEEE Transactions on Circuits and Systems I: Regular Papers, vol. 65, no. 10, pp. 3174-3185, Oct. 2018, doi: 10.1109/TCSI.2018.2809924
    </a>
  </p>

  <p>[4] , J. Craninckx, R. Singh, P. Reynaert, S. Malotaux and J. R. Long, "A Dual-Notch +27dBm Tx-Power Electrical-Balance Duplexer," 
    <a href="https://ieeexplore.ieee.org/document/6942122">
      ESSCIRC 2014 - 40th European Solid State Circuits Conference (ESSCIRC), Venice Lido, Italy, 2014, pp. 463-466, doi: 10.1109/ESSCIRC.2014.6942122
    </a>
  </p>

  <p>[5] S. H. Abdelhalem, P. S. Gudem and L. E. Larson, "Tunable CMOS Integrated Duplexer With Antenna Impedance Tracking and High Isolation in the Transmit and Receive Bands," in 
    <a href="https://rfic.ucsd.edu/wp-content/uploads/2024/12/2014-Tunable_CMOS_Integrated_Duplexer_With_Antenna_Impedance_Tracking_and_High_Isolation_in_the_Transmit_and_Receive_Bands.pdf">
      IEEE Transactions on Microwave Theory and Techniques, vol. 62, no. 9, pp. 2092-2104, Sept. 2014, doi: 10.1109/TMTT.2014.2338271
    </a>
  </p>

  <p>[6] B. van Liempd, P. Wambacq and J. Craninckx, "An inductorless electrical-balance 360° phase shifter for 0.5-1.15GHz in 0.18μm CMOS," <a href = https://ieeexplore.ieee.org/document/7345086> 2015 10th European Microwave Integrated Circuits Conference (EuMIC), Paris, France, 2015, pp. 132-135, doi: 10.1109/EuMIC.2015.7345086.
  </a></p>

  <p>[7] E. F. Sartori, "Hybrid Transformers", <a href="https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=1135893"> IEEE Transactions on Parts, Materials and Packaging, Vol. pmp-4, No. 3, Sep 1968.</a></p>

  <p>[8] M. Mikhemar, H. Darabi and A. Abidi, "A tunable integrated duplexer with 50dB isolation in 40nm CMOS," <a href = "https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=4977470">2009 IEEE International Solid-State Circuits Conference - Digest of Technical Papers, San Francisco, CA, USA, 2009, pp. 386-387,387a, doi: 10.1109/ISSCC.2009.4977470.</a></p>

</div>