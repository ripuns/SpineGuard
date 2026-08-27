import unittest
import numpy as np
import math

class TestPosturePipelineMath(unittest.TestCase):
    def test_derived_features(self):
        ax, ay, az = 0.1, 0.2, 9.8
        gx, gy, gz = 0.5, 0.3, 0.1
        
        accel_mag = np.sqrt(ax**2 + ay**2 + az**2)
        gyro_mag = np.sqrt(gx**2 + gy**2 + gz**2)
        tilt_angle = math.degrees(math.acos(az / (accel_mag + 1e-6)))
        
        self.assertAlmostEqual(accel_mag, 9.8025, places=3)
        self.assertAlmostEqual(gyro_mag, 0.5916, places=3)
        self.assertTrue(0 <= tilt_angle <= 90)

    def test_posture_classification_bounds(self):
        # Az close to 1.0 (vertical upright sitting)
        ax_good, ay_good, az_good = 0.12, 0.05, 0.98
        accel_mag = math.sqrt(ax_good**2 + ay_good**2 + az_good**2)
        angle_good = math.degrees(math.acos(az_good / (accel_mag + 1e-6)))
        
        # Az decayed (slouching forward)
        ax_bad, ay_bad, az_bad = 0.85, 0.15, 0.52
        accel_mag_bad = math.sqrt(ax_bad**2 + ay_bad**2 + az_bad**2)
        angle_bad = math.degrees(math.acos(az_bad / (accel_mag_bad + 1e-6)))
        
        self.assertTrue(angle_good < 20.0 or (90 - angle_good) > 70.0)
        self.assertTrue(angle_bad > angle_good)

if __name__ == "__main__":
    unittest.main()

