import unittest
import random
from itertools import product
from paint import Paint, Stop, Unresolved, contrast, rgb, worst

class PaintTests(unittest.TestCase):
    def test_known_opaque_values(self):
        self.assertEqual(contrast(rgb('#000000'),rgb('#ffffff')),21)
        self.assertEqual(worst(rgb('#000000'),Paint(rgb('#ffffff')),4.5)['ratio'],21)

    def test_task08_endpoint_trap(self):
        p=Paint(rgb('#ffffff'),.01); ink=rgb('#767676')
        self.assertGreater(contrast(ink,p.sample((0,0,0))),4.5)
        self.assertGreater(contrast(ink,p.sample((1,1,1))),4.5)
        result=worst(ink,p,4.5)
        self.assertEqual(result['status'],'FAIL')
        self.assertAlmostEqual(result['ratio'],1,places=12)
        self.assertAlmostEqual(result['backdrop'][0],.4573182808476926,places=12)

    def test_gradient_interior_is_worse_than_both_stops(self):
        p=Paint(rgb('#ffffff'),1,(Stop(0,rgb('#ff0000'),1),Stop(1,rgb('#00ff00'),1)))
        ink=rgb('#000000')
        self.assertGreater(contrast(ink,p.sample((0,0,0),0)),4.5)
        self.assertGreater(contrast(ink,p.sample((0,0,0),1)),4.5)
        r=worst(ink,p,4.5)
        self.assertEqual(r['status'],'FAIL')
        self.assertGreater(r['position'],0); self.assertLess(r['position'],1)

    def test_premultiplied_alpha(self):
        p=Paint(rgb('#000000'),1,(Stop(0,rgb('#ff0000'),0),Stop(1,rgb('#0000ff'),1)))
        self.assertEqual(p.sample((0,0,0),.5),(0,0,.5))

    def test_backdrop_box_and_colored_equal_luminance(self):
        p=Paint(rgb('#ffffff'),0,low=(.2,.1,.1),high=(.7,.8,.9))
        r=worst(rgb('#357faf'),p,3)
        self.assertAlmostEqual(r['ratio'],1,places=12)
        self.assertTrue(all(a<=v<=b for a,v,b in zip(p.low,r['backdrop'],p.high)))

    def test_multi_stop_and_narrow_interior(self):
        p=Paint(rgb('#ffffff'),1,(Stop(0,rgb('#ffffff'),1),
          Stop(.333333,rgb('#777777'),1),Stop(.333334,rgb('#ffffff'),1),Stop(1,rgb('#ffffff'),1)))
        self.assertAlmostEqual(worst(rgb('#777777'),p,4.5)['ratio'],1,places=12)

    def test_unsupported_fails_closed(self):
        for options in [dict(space='oklch'),dict(blend='multiply'),dict(alpha=float('nan')),
          dict(stops=(Stop(0,(1,1,1),1),Stop(0,(0,0,0),1),Stop(1,(1,1,1),1)))]:
            with self.assertRaises(Unresolved): Paint((1,1,1),**options)
        with self.assertRaises(Unresolved): rgb('#ffffff80')

    def test_no_rounding_up(self):
        p=Paint(rgb('#ffffff'))
        exact=contrast(rgb('#777777'),rgb('#ffffff'))
        self.assertEqual(worst(rgb('#777777'),p,exact)['status'],'UNRESOLVED')
        self.assertEqual(worst(rgb('#777777'),p,4.5)['status'],'FAIL')

    def test_source_over_order(self):
        p=Paint((1,0,0),.5,(Stop(0,(0,0,1),.5),Stop(1,(0,0,1),.5)))
        self.assertEqual(p.sample((1,1,1)),(.5,.25,.75))

    def test_continuous_search_bounds_independent_dense_rgb_grid(self):
        rand=random.Random(18)
        for _ in range(12):
            color=lambda:tuple(rand.random() for _ in range(3))
            p=Paint(color(),rand.random(),(Stop(0,color(),rand.random()),Stop(1,color(),rand.random())))
            ink=color(); answer=worst(ink,p,4.5)['ratio']
            grid_min=min(contrast(ink,p.sample(b,x/32)) for b in product([0,.25,.5,.75,1],repeat=3) for x in range(33))
            self.assertLessEqual(answer,grid_min+1e-10)

if __name__=='__main__': unittest.main()
